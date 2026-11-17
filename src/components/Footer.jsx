import { ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { company, contactPlaceholders } from '../data/company'
import { navigation } from '../data/navigation'
import { services } from '../data/services'

const copyrightYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo light />
            <p>Thoughtful construction and exceptional finishes. Bringing your vision to life, from foundation to final detail.</p>
            <p className="footer-registration">RC {company.rcNumber}<span>Registered <time dateTime={company.registrationDateISO}>{company.registrationDate}</time> · {company.registrationStatus}</span></p>
            <Link to="/contact" className="footer-project-link">Let’s build something remarkable<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
          <div className="footer-links">
            <h2>Explore</h2>
            {navigation.filter((item) => item.to !== '/').map((item) => <Link key={item.to} to={item.to}>
              {item.label === 'About' ? 'About us' : item.label}
            </Link>)}
          </div>
          <div className="footer-links">
            <h2>Our expertise</h2>
            {services.slice(0, 4).map((service) => <Link key={service.slug} to={`/services/${service.slug}`}>
              {service.shortTitle}
            </Link>)}
            <Link to="/services" className="footer-all-services">All eight services<ArrowUpRight size={13} aria-hidden="true" /></Link>
          </div>
          <div className="footer-contact">
            <h2>Get in touch</h2>
            <div>
              <Phone size={16} aria-hidden="true" />
              {company.phone ? <a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>
                {company.phone}
              </a> : <span>
                {contactPlaceholders.phone}
              </span>}
            </div>
            <div>
              <Mail size={16} aria-hidden="true" />
              {company.email ? <a href={`mailto:${company.email}`}>
                {company.email}
              </a> : <span>
                {contactPlaceholders.email}
              </span>}
            </div>
            <div>
              <MapPin size={17} aria-hidden="true" />
              <span>
                {company.address || contactPlaceholders.address}
              </span>
            </div>
            {!company.phone && !company.email && <p className="footer-placeholder-note">Contact information awaiting confirmation.</p>}
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {copyrightYear} {company.companyName}. All rights reserved.</p>
          <p>Stock imagery & demonstration content where indicated.</p>
          <a href="#main-content" className="back-to-top">Back to top <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </div>
    </footer>
  )
}
