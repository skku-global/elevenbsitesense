import { ArrowDown, ArrowUpRight, Check, Layers3, Ruler, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import ProjectCard from '../components/ProjectCard'
import ClientFeedback from '../components/ClientFeedback'
import OfficeAddress from '../components/OfficeAddress'
import SiteImage from '../components/SiteImage'
import ContactCTA from '../components/ContactCTA'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import { company } from '../data/company'
import { media } from '../data/media'
import { services } from '../data/services'
import { projects } from '../data/projects'

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
            <h1 id="home-heading">We Build It<br /><em>Better.</em></h1>
            <p className="hero-description">{company.descriptionShort}</p>
            <div className="hero-actions">
              <Button to="/services">Explore Our Services</Button>
              <Button to="/contact" variant="white-outline" diagonal>Contact Us</Button>
            </div>
          </Reveal>
          <div className="hero-bottom">
            <a href="#our-services" className="hero-scroll"><span className="hero-scroll-icon">
                <ArrowDown size={18} strokeWidth={1.5} aria-hidden="true" />
              </span>DISCOVER THE POSSIBILITIES</a>
            <p>ARCHITECTURAL INSPIRATION<span>Illustrative design reference</span></p>
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
          <div className="services-grid services-grid--full">
            {services.map((service, index) => <Reveal key={service.slug} delay={(index % 4) * 0.06}>
              <ServiceCard service={service} index={index} />
            </Reveal>)}
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
            <p>{company.descriptionShort}</p>
            <p>{company.mission}</p>
            <ul className="check-list">
              {company.strengths.slice(0, 3).map((strength) => <li key={strength}><Check size={16} aria-hidden="true" />{strength}</li>)}
            </ul>
            <Button to="/about" variant="outline" diagonal>Discover our approach</Button>
            <div className="company-facts">
              <p className="company-registration-summary">Registered in Nigeria <span aria-hidden="true">·</span> <Link to="/about">RC {company.rcNumber}<ArrowUpRight size={13} aria-hidden="true" /></Link></p>
              <OfficeAddress />
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
              <Link className="text-link" to="/projects">Explore the concepts <ArrowUpRight size={17} aria-hidden="true" /></Link>
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
          <ClientFeedback />
        </div>
      </section>
      <ContactCTA />
    </>
  )
}
