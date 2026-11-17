import PageIntro from '../components/PageIntro'
import ClientFeedback from '../components/ClientFeedback'
import ContactCTA from '../components/ContactCTA'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import { media } from '../data/media'

export default function Testimonials() {
  return (
    <>
      <SEO
        title="The client experience"
        description="A place for approved client feedback on ELEVEN B SITE SENSE construction and finishing services. Contact us to share your experience."
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
            <ClientFeedback />
          </Reveal>
        </div>
      </section>
      <ContactCTA />
    </>
  )
}
