import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import OfficeAddress from './OfficeAddress'
import { company, getEmailUrl, getPhoneUrl, getWhatsAppUrl } from '../data/company'

export default function CompanyContactDetails({ compact = false, showPerson = true }) {
  return (
    <div className={`company-contact-details${compact ? ' company-contact-details--compact' : ''}`}>
      {showPerson && <div className="company-contact-person">
        <p className="small-label">YOUR CONTACT</p>
        <p>{company.contactPerson}</p>
      </div>}
      <div className="company-contact-block">
        <div className="company-contact-label"><Phone size={18} strokeWidth={1.4} aria-hidden="true" /><h3>Phone & WhatsApp</h3></div>
        <ul className="company-phone-list">
          {company.phoneNumbers.map((contact) => <li key={contact.number}>
            <a className="company-phone-link" href={getPhoneUrl(contact)} aria-label={`Call ${company.contactPerson} on ${contact.number}`}>{contact.number}</a>
            {contact.international === company.whatsapp ? <a className="company-whatsapp-link" href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" aria-label={`Message ${company.contactPerson} on WhatsApp at ${company.whatsappDisplay}`}>
              <MessageCircle size={15} strokeWidth={1.5} aria-hidden="true" /><span>WhatsApp</span>
            </a> : <span className="small-label">Alternative phone</span>}
          </li>)}
        </ul>
      </div>
      <div className="company-contact-block">
        <div className="company-contact-label"><Mail size={18} strokeWidth={1.4} aria-hidden="true" /><h3>Email</h3></div>
        <a className="company-email-link" href={getEmailUrl()}>{company.email}</a>
      </div>
      <div className="company-contact-block">
        <div className="company-contact-label"><MapPin size={19} strokeWidth={1.4} aria-hidden="true" /><h3>Office address</h3></div>
        <OfficeAddress />
      </div>
    </div>
  )
}
