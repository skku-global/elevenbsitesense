import fengari from 'fengari'

const { lua, lauxlib, lualib, to_luastring } = fengari

function push(L, value) {
  if (value === null || value === undefined) lua.lua_pushnil(L)
  else if (typeof value === 'boolean') lua.lua_pushboolean(L, value)
  else if (typeof value === 'number') lua.lua_pushnumber(L, value)
  else if (typeof value === 'string') lua.lua_pushliteral(L, value)
  else {
    lua.lua_newtable(L)
    if (Array.isArray(value)) {
      value.forEach((item, index) => { push(L, item); lua.lua_rawseti(L, -2, index + 1) })
    } else for (const [key, item] of Object.entries(value)) { push(L, item); lua.lua_setfield(L, -2, to_luastring(key)) }
  }
}

function read(L, position) {
  const index = lua.lua_absindex(L, position)
  switch (lua.lua_type(L, index)) {
    case lua.LUA_TNIL: return null
    case lua.LUA_TBOOLEAN: return lua.lua_toboolean(L, index)
    case lua.LUA_TNUMBER: return lua.lua_tonumber(L, index)
    case lua.LUA_TSTRING: return lua.lua_tojsstring(L, index)
    case lua.LUA_TTABLE: {
      const entries = []
      lua.lua_pushnil(L)
      while (lua.lua_next(L, index)) { entries.push([read(L, -2), read(L, -1)]); lua.lua_pop(L, 1) }
      if (entries.length && entries.every(([key]) => Number.isInteger(key) && key >= 1 && key <= entries.length)) return Array.from({ length: entries.length }, (_, index) => entries.find(([key]) => key === index + 1)[1])
      return Object.fromEntries(entries)
    }
    default: throw new Error('Unsupported Lua value')
  }
}

// Executes the actual production Lua, rather than duplicating its reservation
// logic in JavaScript. Only the native Redis commands and cjson bridge are mocked.
export class RedisFixture {
  constructor(now = 1_800_000_000_000) { this.now = now; this.values = new Map(); this.expiry = new Map() }
  get(key) {
    if (this.expiry.has(key) && this.expiry.get(key) <= this.now) { this.values.delete(key); this.expiry.delete(key) }
    return this.values.get(key)
  }
  call([command, key, value]) {
    switch (command.toUpperCase()) {
      case 'GET': return this.get(key) ?? false
      case 'SET': this.values.set(key, String(value)); this.expiry.delete(key); return 'OK'
      case 'INCR': { const count = Number(this.get(key) || 0) + 1; this.values.set(key, String(count)); return count }
      case 'EXPIRE': this.expiry.set(key, this.now + Number(value) * 1000); return 1
      case 'TTL': return this.get(key) === undefined ? -2 : this.expiry.has(key) ? Math.max(0, Math.ceil((this.expiry.get(key) - this.now) / 1000)) : -1
      default: throw new Error(`Unimplemented Redis command: ${command}`)
    }
  }
  eval(command) {
    const [, script, keyCount, ...parameters] = command
    const L = lauxlib.luaL_newstate()
    try {
      lualib.luaL_openlibs(L)
      push(L, parameters.slice(0, Number(keyCount))); lua.lua_setglobal(L, to_luastring('KEYS'))
      push(L, parameters.slice(Number(keyCount))); lua.lua_setglobal(L, to_luastring('ARGV'))
      lua.lua_newtable(L)
      lua.lua_pushcfunction(L, (state) => { push(state, this.call(Array.from({ length: lua.lua_gettop(state) }, (_, index) => read(state, index + 1)))); return 1 })
      lua.lua_setfield(L, -2, to_luastring('call')); lua.lua_setglobal(L, to_luastring('redis'))
      lua.lua_newtable(L)
      lua.lua_pushcfunction(L, (state) => { push(state, JSON.stringify(read(state, 1))); return 1 }); lua.lua_setfield(L, -2, to_luastring('encode'))
      lua.lua_pushcfunction(L, (state) => { push(state, JSON.parse(read(state, 1))); return 1 }); lua.lua_setfield(L, -2, to_luastring('decode'))
      lua.lua_setglobal(L, to_luastring('cjson'))
      if (lauxlib.luaL_loadstring(L, to_luastring(script)) || lua.lua_pcall(L, 0, 1, 0)) throw new Error(lua.lua_tojsstring(L, -1))
      return read(L, -1)
    } finally { lua.lua_close(L) }
  }
  async fetch(_url, options) {
    return new Response(JSON.stringify({ result: this.eval(JSON.parse(options.body)) }), { headers: { 'Content-Type': 'application/json' } })
  }
}
