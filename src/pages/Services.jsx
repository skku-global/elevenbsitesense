import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import ServiceCard from '../components/ServiceCard'
import SectionHeading from '../components/SectionHeading'
import ContactCTA from '../components/ContactCTA'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import { services } from '../data/services'
import { media } from '../data/media'

export default function Services() {
  return (
    <>
      <SEO
        title="Our services"
        description="Explore all eight construction and finishing services: building contracting, swimming pools, P.O.P. ceilings, interior design, tiling, interlock, stamped interlock, and painting."
      />
      <PageIntro
        eyebrow="EIGHT SERVICES. ONE CONNECTED VISION."
        title={<>Expertise, from<br /><em>the ground up.</em></>}
        description="From the structure that starts it all to the surfaces that complete it. Discover the right expertise for your project."
        image={media.architecture}
        alt="Contemporary interior with precise surfaces, warm materials, and architectural detailing"
        breadcrumbs={[{ label: 'Services' }]}
      />
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="OUR COMPLETE SERVICE RANGE"
              title="The craft behind your space."
              description="Explore each service to understand the possibilities, the details we consider, and the process ahead."
            />
          </Reveal>
          <div className="services-grid services-grid--full">
            {services.map((service, index) => <Reveal key={service.slug} delay={(index % 4) * 0.05}>
              <ServiceCard service={service} index={index} />
            </Reveal>)}
          </div>
        </div>
      </section>
      <section className="coordination-band">
        <div className="container">
          <div>
            <p className="eyebrow">BETTER, TOGETHER</p>
            <h2>One brief. A beautifully<br />coordinated result.</h2>
          </div>
          <div>
            <p>Planning a new build or a complete transformation? Talk to us about combining services into one considered scope, with the materials, sequence, and finishing details planned together.</p>
            <Link className="text-link" to="/contact">Discuss a combined project<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
      <ContactCTA title="The right expertise starts with the right conversation." />
    </>
  )
}
