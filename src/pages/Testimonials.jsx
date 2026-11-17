import { Info, MessagesSquare } from 'lucide-react'
import PageIntro from '../components/PageIntro'
import TestimonialCard from '../components/TestimonialCard'
import ContactCTA from '../components/ContactCTA'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import Button from '../components/Button'
import { testimonials } from '../data/testimonials'
import { media } from '../data/media'

export default function Testimonials() {
  return (
    <>
      <SEO
        title="The client experience"
        description="Explore our testimonial presentation with clearly labelled demonstration feedback. Real, approved client testimonials will be added when supplied."
      />
      <PageIntro
        eyebrow="THE PEOPLE BEHIND EVERY SPACE"
        title={<>Good work.<br /><em>Lasting impressions.</em></>}
        description="A place for the experiences, conversations, and perspectives of the people we build for."
        image={media.interior}
        alt="Comfortable, thoughtfully designed living room with warm natural light"
        breadcrumbs={[{ label: 'Testimonials' }]}
      />
      <section className="section testimonials-page">
        <div className="container">
          <Reveal>
            <div className="demo-notice">
              <Info size={21} strokeWidth={1.4} aria-hidden="true" />
              <div>
                <h2>Demonstration feedback, clearly labelled.</h2>
                <p>The quotes below are sample writing, not statements from real customers. No customer identities or ratings are being claimed. Verified testimonials will be published with the clients’ permission.</p>
              </div>
            </div>
          </Reveal>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => <Reveal key={testimonial.id} delay={(index % 3) * 0.06}>
              <TestimonialCard testimonial={testimonial} />
            </Reveal>)}
          </div>
          <Reveal className="feedback-invitation">
            <MessagesSquare size={36} strokeWidth={1.2} aria-hidden="true" />
            <div>
              <h2>Your experience matters.</h2>
              <p>Worked with the company? Once our contact channel is configured, you can share your feedback and discuss permission for it to appear here.</p>
            </div>
            <Button to="/contact" variant="outline" diagonal>Get in touch</Button>
          </Reveal>
        </div>
      </section>
      <ContactCTA />
    </>
  )
}
