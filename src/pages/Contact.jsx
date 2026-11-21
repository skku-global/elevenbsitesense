import { ArrowUpRight, MessageCircle } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import ContactForm from '../components/ContactForm'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import CompanyRegistration from '../components/CompanyRegistration'
import CompanyContactDetails from '../components/CompanyContactDetails'
import OfficeAddress from '../components/OfficeAddress'
import { company, getWhatsAppUrl } from '../data/company'

export default function Contact() {
  const { search } = useLocation()
  const whatsappUrl = getWhatsAppUrl()
  return (
    <>
      <SEO
        title="Contact us"
        description={`Contact ${company.brandName} about construction, pools, interiors, tiling, paving, or painting. Share your project brief and request a quotation.`}
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
            <CompanyContactDetails />
            {company.officeHours && <p>Office hours: {company.officeHours}</p>}
            <CompanyRegistration compact />
            <div className="contact-whatsapp">
              <MessageCircle size={25} strokeWidth={1.3} aria-hidden="true" />
              <h3>Prefer a conversation on WhatsApp?</h3>
              <p>
                Share your project ideas, drawings or photographs with {company.contactPerson} and discuss the next step.
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
      <section className="contact-location" aria-labelledby="contact-office-heading">
        <div className="container contact-location-grid">
          <Reveal className="contact-office-intro">
            <p className="eyebrow">OUR OFFICE IN IBADAN</p>
            <h2 id="contact-office-heading">Start the conversation.<br /><em>Plan the possibilities.</em></h2>
          </Reveal>
          <Reveal className="contact-office-details">
            <OfficeAddress />
            <p className="contact-office-support">Contact {company.contactPerson} to arrange a visit. Include your project location so we can discuss availability, site access and logistics.</p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
