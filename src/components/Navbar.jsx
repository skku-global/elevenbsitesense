import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react'
import Logo from './Logo'
import Button from './Button'
import { navigation } from '../data/navigation'
import { services } from '../data/services'
import { company } from '../data/company'

export default function Navbar() {
  const { key: locationKey } = useLocation()
  const [menuLocationKey, setMenuLocationKey] = useState(locationKey)
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const header = useRef(null)
  const menuButton = useRef(null)
  const servicesButton = useRef(null)
  const mobilePanel = useRef(null)

  // Reset menu state before committing a new route without remounting the header.
  // This also handles Back/Forward and navigating to the current route.
  if (menuLocationKey !== locationKey) {
    setMenuLocationKey(locationKey)
    setMobileOpen(false)
    setServicesOpen(false)
    setMobileServicesOpen(false)
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const onOutside = (event) => { if (!header.current?.contains(event.target)) setServicesOpen(false) }
    const onKey = (event) => {
      if (event.key === 'Escape' && servicesOpen) { setServicesOpen(false); servicesButton.current?.focus() }
    }
    document.addEventListener('pointerdown', onOutside)
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('pointerdown', onOutside); document.removeEventListener('keydown', onKey) }
  }, [servicesOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    header.current?.style.setProperty('--menu-top', `${header.current.getBoundingClientRect().bottom}px`)
    mobilePanel.current?.querySelector('a, button')?.focus()
    const onKey = (event) => {
      if (event.key === 'Escape') { setMobileOpen(false); menuButton.current?.focus() }
      if (event.key === 'Tab') {
        const elements = [...mobilePanel.current.querySelectorAll('a, button')].filter((element) => element.getClientRects().length)
        const first = elements[0]
        const last = elements[elements.length - 1]
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
        if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
      }
    }
    const onResize = () => {
      if (window.innerWidth > 1100) setMobileOpen(false)
      else header.current?.style.setProperty('--menu-top', `${header.current.getBoundingClientRect().bottom}px`)
    }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener('keydown', onKey); window.removeEventListener('resize', onResize) }
  }, [mobileOpen])

  return (
      <header
        ref={header}
        className={`site-header${scrolled ? ' is-scrolled' : ''}${mobileOpen ? ' mobile-is-open' : ''}`}
      >
        <div className="container navbar">
          <Logo />
          <nav className="desktop-nav" aria-label="Main navigation">
            {navigation.map((item) => item.dropdown ? (
              <div
              className="nav-services"
              key={item.to}
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setServicesOpen(false) }}
            >
              <div className="nav-services-trigger">
                <NavLink to={item.to}>
                  {item.label}
                </NavLink>
                <button
                  type="button"
                  ref={servicesButton}
                  className="dropdown-toggle"
                  aria-label="Show service navigation"
                  aria-expanded={servicesOpen}
                  aria-controls="services-dropdown"
                  onClick={() => setServicesOpen(!servicesOpen)}
                >
                  <ChevronDown size={13} aria-hidden="true" />
                </button>
              </div>
              <div id="services-dropdown" className="services-dropdown" hidden={!servicesOpen}>
                <p className="eyebrow">FROM FOUNDATION TO FINISH</p>
                <div className="dropdown-grid">
                  {services.map((service, index) => <Link key={service.slug} to={`/services/${service.slug}`}>
                    <span>
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    {service.title}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </Link>)}
                </div>
                <Link className="dropdown-overview" to="/services">Explore all services<ArrowUpRight size={16} aria-hidden="true" /></Link>
              </div>
            </div>
            ) : <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              {item.label}
            </NavLink>)}
          </nav>
          <Button
            to="/contact"
            variant="outline"
            className="nav-cta"
            diagonal
          >Start a project</Button>
          <button
            ref={menuButton}
            type="button"
            className="mobile-menu-toggle"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => { setMobileOpen(!mobileOpen); if (mobileOpen) menuButton.current?.focus() }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <div
          className="mobile-navigation"
          id="mobile-navigation"
          hidden={!mobileOpen}
          ref={mobilePanel}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div className="mobile-panel-header">
            <span>EXPLORE</span>
            <button
              type="button"
              aria-label="Close mobile navigation"
              onClick={() => { setMobileOpen(false); menuButton.current?.focus() }}
            >
              <X size={21} />
            </button>
          </div>
          <nav aria-label="Mobile navigation">
            {navigation.map((item) => item.dropdown ? <div className="mobile-services" key={item.to}>
              <div className="mobile-service-heading">
                <NavLink to={item.to}>
                  {item.label}
                </NavLink>
                <button
                  type="button"
                  aria-label="Show individual services"
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mobile-service-links"
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                >
                  <ChevronDown size={19} />
                </button>
              </div>
              <div id="mobile-service-links" hidden={!mobileServicesOpen}>
                {services.map((service) => <Link key={service.slug} to={`/services/${service.slug}`}>
                  {service.title}
                </Link>)}
              </div>
            </div> : <NavLink to={item.to} end={item.to === '/'} key={item.to}>
              {item.label}
              <ArrowUpRight size={19} aria-hidden="true" />
            </NavLink>)}
            <Button to="/contact" diagonal>Start a project</Button>
            <p className="mobile-menu-note">{company.slogan}</p>
          </nav>
        </div>
      </header>
  )
}
