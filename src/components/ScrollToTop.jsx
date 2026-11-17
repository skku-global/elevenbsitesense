import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  const previousPath = useRef(pathname)
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) {
        const target = document.getElementById(decodeURIComponent(hash.slice(1)))
        if (target) { target.scrollIntoView({ behavior: 'smooth' }); return }
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      if (previousPath.current !== pathname) {
        document.getElementById('main-content')?.focus({ preventScroll: true })
      }
      previousPath.current = pathname
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, hash])
  return null
}
