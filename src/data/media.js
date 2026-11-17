import fallback from '../assets/images/architecture-fallback.svg'

// Illustrative Unsplash stock photography, not company project photographs.
// A local architectural illustration prevents broken images when offline.
const photo = (id, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`

export const imageFallback = fallback
export const media = {
  hero: photo('photo-1613490493576-7fde63acd811', 2200),
  residence: photo('photo-1600585154340-be6161a56a0c', 1400),
  architecture: photo('photo-1600607687920-4e2a09cf159d', 1400),
  interior: photo('photo-1600210492486-724fe5c67fb0'),
  pool: photo('photo-1576013551627-0cc20b96c2a7'),
  ceiling: photo('photo-1600607687939-ce8a6c25118c'),
  tiling: photo('photo-1620626011761-996317b8d101'),
  paving: photo('photo-1600585154340-be6161a56a0c'),
  stamped: photo('photo-1600047509807-ba8f99d2cdde'),
  painting: photo('photo-1600566753190-17f0baa2a6c3'),
  construction: photo('photo-1504307651254-35680f356dfd'),
  courtyard: photo('photo-1600607688969-a5bfcd646154'),
}
