import { ArrowDown, ArrowUpRight, Check, Layers3, Ruler, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import ProjectCard from '../components/ProjectCard'
import TestimonialCard from '../components/TestimonialCard'
import SiteImage from '../components/SiteImage'
import ContactCTA from '../components/ContactCTA'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import { company, companyFacts } from '../data/company'
import { media } from '../data/media'
import { services } from '../data/services'
import { projects } from '../data/projects'
import { testimonials } from '../data/testimonials'

const promises = [
  { Icon: Ruler, title: 'Precision in every detail', text: 'A considered approach to every stage.' },
  { Icon: Layers3, title: 'From foundation to finish', text: 'Eight services. One connected vision.' },
  { Icon: ShieldCheck, title: 'Built around your vision', text: 'Your ideas at the heart of the process.' },
]

export default function Home() {
  return (
    <>
      <SEO
        title="Construction & Building Services"
        description={`${company.brandName} brings building, swimming pools, P.O.P. ceilings, interiors, tiling, paving, and painting together. Discuss your next project.`}
      />
      <section className="home-hero" aria-labelledby="home-heading">
        <SiteImage
          className="home-hero-image"
          src={media.hero}
          alt="Contemporary white villa with expansive windows, a swimming pool, and landscaped outdoor living space"
          eager
          width={2200}
          height={1400}
          position="center 56%"
        />
        <div className="hero-shade" aria-hidden="true" />
        <div className="container home-hero-inner">
          <Reveal className="hero-copy">
            <p className="eyebrow eyebrow--light">EXPERTISE FROM FOUNDATION TO FINISH</p>
            <h1 id="home-heading">Your vision.<br />Built <em>beautifully.</em></h1>
            <p className="hero-description">Thoughtful construction. Exceptional finishes.<br className="desktop-break" /> Creating spaces you’ll be proud to call your own.</p>
            <div className="hero-actions">
              <Button to="/services">Explore Our Services</Button>
              <Button to="/contact" variant="white-outline" diagonal>Contact Us</Button>
            </div>
          </Reveal>
          <div className="hero-bottom">
            <a href="#our-services" className="hero-scroll"><span className="hero-scroll-icon">
                <ArrowDown size={18} strokeWidth={1.5} aria-hidden="true" />
              </span>DISCOVER THE POSSIBILITIES</a>
            <p>ARCHITECTURAL INSPIRATION<span>Illustrative stock photography</span></p>
          </div>
        </div>
        <span className="hero-side-label" aria-hidden="true">THE ART OF BUILDING WELL</span>
      </section>
      <section className="promise-strip" aria-label="Our approach">
        <div className="container promise-grid">
          {promises.map(({ Icon, title, text }) => <div className="promise" key={title}>
            <Icon size={28} strokeWidth={1.2} aria-hidden="true" />
            <div>
              <h2>
                {title}
              </h2>
              <p>
                {text}
              </p>
            </div>
          </div>)}
        </div>
      </section>
      <section className="section home-services" id="our-services">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="01 / OUR EXPERTISE"
              title={<>Every detail.<br />Every possibility.</>}
              description="From ambitious new builds to the finishes that make a space yours, our expertise brings your ideas together."
            >
              <Link className="text-link" to="/services">View all services <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </SectionHeading>
          </Reveal>
          <div className="services-grid">
            {services.slice(0, 4).map((service, index) => <Reveal key={service.slug} delay={index * 0.06}>
              <ServiceCard service={service} index={index} />
            </Reveal>)}
          </div>
          <div className="more-expertise">
            <p>AND THE DETAILS<br />THAT COMPLETE IT</p>
            <div>
              {services.slice(4).map((service) => <Link to={`/services/${service.slug}`} key={service.slug}>
                {service.title}
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>)}
            </div>
          </div>
        </div>
      </section>
      <section className="section home-about">
        <div className="container home-about-grid">
          <Reveal className="home-about-visual">
            <SiteImage
              src={media.architecture}
              alt="Sunlit contemporary interior with natural materials and thoughtful architectural detailing"
              width={1000}
              height={1200}
            />
            <div className="about-image-note">
              <span className="small-label">THE {company.brandName} APPROACH</span>
              <p>Purpose in the plan.<br /><em>Care in the craft.</em></p>
            </div>
          </Reveal>
          <Reveal className="home-about-copy">
            <p className="eyebrow">02 / A BETTER WAY TO BUILD</p>
            <h2>Great spaces start<br />with a clear vision.</h2>
            <p>At {company.brandName}, we believe the best spaces are built through thoughtful planning, open conversation, and care for the details.</p>
            <p>From the structure that supports your home to the finishes you see and feel every day, we bring a coordinated approach to construction and design.</p>
            <ul className="check-list">
              <li><Check size={16} aria-hidden="true" />A clear scope and considered material choices</li>
              <li><Check size={16} aria-hidden="true" />Construction and finishing, planned together</li>
              <li><Check size={16} aria-hidden="true" />A personal approach to your project</li>
            </ul>
            <Button to="/about" variant="outline" diagonal>Discover our approach</Button>
            <div className="company-facts">
              <p className="company-registration-summary">Registered in Nigeria <span aria-hidden="true">·</span> <Link to="/about">RC {company.rcNumber}<ArrowUpRight size={13} aria-hidden="true" /></Link></p>
              <p className="company-facts-label">PROJECT & TEAM DETAILS · AWAITING VERIFICATION</p>
              <div className="company-facts-grid">
                {companyFacts.map((fact) => <div key={fact.label}>
                  <strong>
                    {fact.value ?? '—'}
                  </strong>
                  <span>
                    {fact.label}
                  </span>
                  {fact.value === null && <small>To be supplied</small>}
                </div>)}
              </div>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section home-projects">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="03 / PROJECT INSPIRATION"
              title={<>A sense of<br />what’s possible.</>}
              description="Considered architecture, inviting interiors, and inspiring outdoor spaces. Explore a few ideas for your next chapter."
            >
              <Link className="text-link" to="/projects">Explore the portfolio <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </SectionHeading>
          </Reveal>
          <p className="demonstration-note"><span>DEMONSTRATION PORTFOLIO</span> These concepts use stock imagery and do not represent completed company projects.</p>
          <div className="featured-projects">
            {projects.slice(0, 3).map((project, index) => <Reveal key={project.slug} className={index === 0 ? 'featured-project-main' : ''} delay={index * 0.05}>
              <ProjectCard project={project} featured={index === 0} />
            </Reveal>)}
          </div>
        </div>
      </section>
      <section className="section home-testimonials">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="04 / THE CLIENT EXPERIENCE"
              title="Good work. Lasting impressions."
              description="A space for the experiences and perspectives of the people we build for."
            >
              <Link className="text-link" to="/testimonials">View testimonials <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </SectionHeading>
          </Reveal>
          <p className="demonstration-note"><span>SAMPLE FEEDBACK</span> Demonstration writing only. Verified client testimonials will be added with permission.</p>
          <div className="testimonials-grid">
            {testimonials.slice(0, 3).map((testimonial, index) => <Reveal key={testimonial.id} delay={index * 0.05}>
              <TestimonialCard testimonial={testimonial} />
            </Reveal>)}
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  )
}
