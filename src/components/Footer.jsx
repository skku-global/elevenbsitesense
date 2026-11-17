import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './Logo'
import { company } from '../data/company'
import CompanyContactDetails from './CompanyContactDetails'
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
            <p className="footer-slogan">{company.slogan}</p>
            <p>{company.missionBrief}</p>
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
            {services.map((service) => <Link key={service.slug} to={`/services/${service.slug}`}>
              {service.shortTitle}
            </Link>)}
            <Link to="/services" className="footer-all-services">All eight services<ArrowUpRight size={13} aria-hidden="true" /></Link>
          </div>
          <div className="footer-contact">
            <h2>Get in touch</h2>
            <CompanyContactDetails compact />
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
