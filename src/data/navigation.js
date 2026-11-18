import { testimonials } from './testimonials'

// The Testimonials page is only listed once approved testimonials exist.
const allNavigation = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services', dropdown: true },
  { label: 'Projects', to: '/projects' },
  { label: 'Testimonials', to: '/testimonials' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Contact', to: '/contact' },
]

export const navigation = allNavigation.filter((item) => item.to !== '/testimonials' || testimonials.length > 0)
