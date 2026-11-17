import { ArrowUpRight, Clock3, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import ContactForm from '../components/ContactForm'
import Button from '../components/Button'
import SiteImage from '../components/SiteImage'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import CompanyRegistration from '../components/CompanyRegistration'
import { company, contactPlaceholders, getWhatsAppUrl } from '../data/company'
import { media } from '../data/media'

export default function Contact() {
  const { search } = useLocation()
  const whatsappUrl = getWhatsAppUrl()
  return (
    <>
      <SEO
        title="Contact us"
        description={`Contact ${company.brandName} about construction, pools, interiors, tiling, paving, or painting. Share your project brief and prepare a quotation enquiry.`}
      />
      <PageIntro
        eyebrow="YOUR VISION STARTS HERE"
        title={<>Let’s build<br /><em>something remarkable.</em></>}
        description="A new idea, a detailed plan, or just a question. We would love to hear what you have in mind."
        breadcrumbs={[{ label: 'Contact us' }]}
      />
      <section className="section contact-page">
        <div className="container contact-layout">
          <Reveal className="contact-information">
            <p className="eyebrow">A PERSONAL CONVERSATION</p>
            <h2>Every great space<br />starts with a hello.</h2>
            <p>Tell us about your project, where it is, and what matters most to you. Your enquiry helps us understand the right next step.</p>
            <div className="contact-details">
              <div className="contact-item">
                <Phone size={20} strokeWidth={1.3} aria-hidden="true" />
                <div>
                  <h3>Call us</h3>
                  {company.phone ? <a href={`tel:${company.phone.replace(/[^+\d]/g, '')}`}>
                    {company.phone}
                  </a> : <p className="contact-placeholder">
                    {contactPlaceholders.phone}
                  </p>}
                </div>
              </div>
              <div className="contact-item">
                <Mail size={20} strokeWidth={1.3} aria-hidden="true" />
                <div>
                  <h3>Email us</h3>
                  {company.email ? <a href={`mailto:${company.email}`}>
                    {company.email}
                  </a> : <p className="contact-placeholder">
                    {contactPlaceholders.email}
                  </p>}
                </div>
              </div>
              <div className="contact-item">
                <MapPin size={21} strokeWidth={1.3} aria-hidden="true" />
                <div>
                  <h3>Our location</h3>
                  <p className={!company.address ? 'contact-placeholder' : ''}>
                    {company.address || contactPlaceholders.address}
                  </p>
                  <small>
                    {company.serviceArea || contactPlaceholders.serviceArea}
                  </small>
                </div>
              </div>
              <div className="contact-item">
                <Clock3 size={20} strokeWidth={1.3} aria-hidden="true" />
                <div>
                  <h3>Office hours</h3>
                  <p className={!company.officeHours ? 'contact-placeholder' : ''}>
                    {company.officeHours || contactPlaceholders.officeHours}
                  </p>
                </div>
              </div>
            </div>
            <CompanyRegistration compact />
            <div className="contact-whatsapp">
              <MessageCircle size={25} strokeWidth={1.3} aria-hidden="true" />
              <h3>Prefer a conversation on WhatsApp?</h3>
              <p>
                {whatsappUrl ? 'Share your project ideas with us directly through our configured WhatsApp contact.' : 'Our WhatsApp contact is awaiting confirmation. You can prepare your enquiry using the form.'}
              </p>
              {whatsappUrl ? <Button
                href={whatsappUrl}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
                diagonal
              >Chat on WhatsApp</Button> : <Button href="#project-enquiry" variant="outline">Use the enquiry form</Button>}
            </div>
            <Link className="text-link contact-faq-link" to="/faq">A few questions before you begin?<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </Reveal>
          <Reveal>
            <ContactForm key={search} />
          </Reveal>
        </div>
      </section>
      <section className="contact-location">
        <div className="container contact-location-grid">
          <div className="contact-location-image">
            <SiteImage
              src={media.residence}
              alt="Modern residential architecture used as inspiration for your future project"
              width={1200}
              height={600}
            />
          </div>
          <div>
            <p className="eyebrow">A SPACE THAT WORKS FOR YOU</p>
            <h2>Your location.<br />Your possibilities.</h2>
            <p>
              {company.serviceArea ? `Our service area: ${company.serviceArea}. Tell us where your project is so we can discuss the details.` : 'Our service locations are being confirmed. Include your project location in your enquiry so that availability, access, and logistics can be discussed.'}
            </p>
            <span className="image-reference-note">Architectural inspiration · Stock photograph</span>
          </div>
        </div>
      </section>
    </>
  )
}
