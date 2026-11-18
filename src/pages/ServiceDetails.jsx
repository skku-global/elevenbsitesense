import { ArrowLeft, Check, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import ContactCTA from '../components/ContactCTA'
import Button from '../components/Button'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import ServiceImageGallery from '../components/ServiceImageGallery'
import ProcessResult from '../components/ProcessResult'
import NotFound from './NotFound'
import { getService, services } from '../data/services'

const processLabels = ['Understand', 'Plan', 'Create', 'Complete']

export default function ServiceDetails() {
  const { slug } = useParams()
  const service = getService(slug)
  if (!service) return <NotFound type="service" />
  const enquiryPath = `/contact?service=${service.slug}`
  const related = service.related.map(getService).filter(Boolean)
  return (
    <>
      <SEO
        title={service.title}
        description={`${service.description} Discover the benefits and our approach to ${service.title.toLowerCase()}, and discuss your project.`}
      />
      <PageIntro
        className="service-detail-hero"
        eyebrow={service.category.toUpperCase()}
        title={service.title}
        description={service.description}
        image={service.image}
        alt={service.alt}
        fallbackSrc={service.fallbackSrc}
        fallbackAlt={service.fallbackAlt}
        fallbackLabel={service.fallbackLabel}
        imagePosition={service.imagePosition}
        imageCaption={service.imageCaption}
        mediaSubject={service.mediaSubject}
        media={service.processImage ? <ProcessResult service={service} /> : null}
        breadcrumbs={[{ label: 'Services', to: '/services' }, { label: service.title }]}
      >
        <Button to={enquiryPath} diagonal>Request a Quote</Button>
      </PageIntro>
      <section className="section">
        <div className="container service-introduction">
          <Reveal>
            <p className="eyebrow">SERVICE OVERVIEW</p>
            <h2>{service.overviewTitle}</h2>
          </Reveal>
          <Reveal className="prose">
            <p>
              {service.introduction}
            </p>
            <p>Every project starts with a conversation. Your requirements, site conditions, preferred materials, and budget help define an appropriate scope and quotation.</p>
            <Link to={enquiryPath} className="text-link">Tell us about your project<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </section>
      <ServiceImageGallery service={service} />
      <section className="section service-benefits">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow="THE DETAILS THAT MATTER" title="Thoughtful choices. A better result." />
          </Reveal>
          <div className="benefits-grid">
            {service.benefits.map((benefit, index) => <Reveal className="benefit-card" key={benefit.title} delay={index * 0.04}>
              <span className="benefit-icon">
                <Check size={19} strokeWidth={1.4} aria-hidden="true" />
              </span>
              <div>
                <h3>
                  {benefit.title}
                </h3>
                <p>
                  {benefit.text}
                </p>
              </div>
            </Reveal>)}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="HOW WE APPROACH YOUR PROJECT"
              title="A clear process, from the outset."
              description="A practical overview. The exact sequence and programme are agreed to suit your particular project."
            />
          </Reveal>
          {service.processSteps ? (
            <div className="process-grid process-grid--photos">
              {service.processSteps.map((step, index) => <Reveal className="process-step process-step--photo" key={step.label} delay={index * 0.05}>
                <div className="process-step-image" style={service.stepAspect ? { aspectRatio: service.stepAspect } : undefined}>
                  <img src={step.image} alt={step.alt} loading="lazy" decoding="async" width={900} height={600} />
                </div>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.label}</h3>
                <p>{step.text}</p>
              </Reveal>)}
            </div>
          ) : (
          <div className="process-grid">
            {service.process.map((step, index) => <Reveal className="process-step" key={step} delay={index * 0.05}>
              <span>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>
                {processLabels[index]}
              </h3>
              <p>
                {step}
              </p>
            </Reveal>)}
          </div>
          )}
        </div>
      </section>
      <section className="section related-section">
        <div className="container">
          <Reveal>
            <SectionHeading eyebrow="BRING THE DETAILS TOGETHER" title="Complementary expertise.">
              <Link to="/services" className="text-link">All services<ArrowUpRight size={17} aria-hidden="true" /></Link>
            </SectionHeading>
          </Reveal>
          <div className="related-services-grid">
            {related.map((item) => <ServiceCard key={item.slug} service={item} index={services.indexOf(item)} />)}
          </div>
          <Link className="back-link" to="/services"><ArrowLeft size={16} aria-hidden="true" />Back to all services</Link>
        </div>
      </section>
      <ContactCTA to={enquiryPath} title="A clear quote. A considered beginning." buttonLabel="Request a Quote" description={`Tell us about your ${service.shortTitle.toLowerCase()} requirements. We’ll discuss the scope, materials, and the right next step for your space.`} />
    </>
  )
}
