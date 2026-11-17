import { Check, Layers3, MessagesSquare, Ruler, Sparkles } from 'lucide-react'
import PageIntro from '../components/PageIntro'
import SectionHeading from '../components/SectionHeading'
import SiteImage from '../components/SiteImage'
import ContactCTA from '../components/ContactCTA'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import CompanyRegistration from '../components/CompanyRegistration'
import { company } from '../data/company'
import { media } from '../data/media'

const values = [
  { Icon: Ruler, title: 'Care for the details', text: 'We believe alignment, preparation, and thoughtful finishing make a meaningful difference to a space.' },
  { Icon: MessagesSquare, title: 'Clear conversations', text: 'A shared understanding of the brief, materials, costs, and next steps is the foundation of a good project.' },
  { Icon: Layers3, title: 'A connected approach', text: 'Structure, surfaces, lighting, and interiors are considered together to create a coherent result.' },
  { Icon: Sparkles, title: 'Purposeful design', text: 'Every choice should balance how a space looks with how it will be used, maintained, and enjoyed.' },
]
const approach = [
  { title: 'Listen & understand', text: 'We begin with your ideas, priorities, site, and the way you want to use the space.' },
  { title: 'Plan & define', text: 'The scope, material direction, quotation, and indicative programme are discussed and agreed.' },
  { title: 'Build & coordinate', text: 'Construction and finishing are coordinated against the plan, with progress and decisions kept clear.' },
  { title: 'Review & hand over', text: 'The final details are inspected, agreed snagging is addressed, and the finished space is reviewed together.' },
]

export default function About() {
  return (
    <>
      <SEO
        title="About us"
        description={`Meet ${company.companyName}. Registered in Nigeria as RC ${company.rcNumber}, with a considered approach to construction, interiors, and finishing.`}
      />
      <PageIntro
        eyebrow="A COMPANY BUILT AROUND YOUR VISION"
        title={<>Purpose in the plan.<br /><em>Care in the craft.</em></>}
        description={company.descriptionShort}
        image={media.construction}
        alt="Construction professionals coordinating work on a building site"
        breadcrumbs={[{ label: 'About us' }]}
      />
      <section className="section">
        <div className="container">
          <div className="about-introduction">
            <Reveal>
              <p className="eyebrow">THE {company.brandName} PHILOSOPHY</p>
              <h2>Building is about more<br />than a finished structure.</h2>
            </Reveal>
            <Reveal className="prose">
              {company.description.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </Reveal>
          </div>
          <Reveal>
            <CompanyRegistration showAddress />
          </Reveal>
        </div>
      </section>
      <section className="mission-section section">
        <div className="container">
          <div className="mission-grid">
            <Reveal className="mission-card">
              <span className="large-index">01</span>
              <p className="eyebrow">OUR MISSION</p>
              <h2>Build relationships.<br />Bring visions to life.</h2>
              <p>{company.mission}</p>
            </Reveal>
            <Reveal className="mission-card" delay={0.08}>
              <span className="large-index">02</span>
              <p className="eyebrow">OUR VISION & GOAL</p>
              <h2>Excellence that<br />adds lasting value.</h2>
              <p>{company.goal}</p>
            </Reveal>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="WHAT GUIDES OUR WORK"
              title="Principles you can build on."
              description="A practical set of values to guide the decisions, conversations, and details throughout your project."
            />
          </Reveal>
          <div className="values-grid">
            {values.map(({ Icon, title, text }, index) => <Reveal className="value-card" key={title} delay={index * 0.05}>
              <Icon size={30} strokeWidth={1.2} aria-hidden="true" />
              <h3>
                {title}
              </h3>
              <p>
                {text}
              </p>
            </Reveal>)}
          </div>
        </div>
      </section>
      <section className="section about-why">
        <div className="container about-why-grid">
          <Reveal className="about-why-image">
            <SiteImage
              src={media.residence}
              alt="Modern residential exterior with warm materials and careful architectural proportions"
              width={1000}
              height={1100}
            />
          </Reveal>
          <Reveal className="about-why-copy">
            <p className="eyebrow">WHY CHOOSE US</p>
            <h2>Skilled people.<br />Considered construction.</h2>
            <p>Our strengths connect practical building expertise with thoughtful design, quality materials, and a flexible approach to your project.</p>
            <ul className="check-list">
              {company.strengths.map((strength) => <li key={strength}><Check size={17} aria-hidden="true" />{strength}</li>)}
            </ul>
          </Reveal>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <Reveal>
            <SectionHeading
              eyebrow="FROM FIRST IDEA TO FINAL DETAIL"
              title="A clear path through your project."
              description="Every brief is different. These four stages provide a practical framework for the conversation."
            />
          </Reveal>
          <div className="process-grid">
            {approach.map((step, index) => <Reveal className="process-step" key={step.title} delay={index * 0.05}>
              <span>
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>
                {step.title}
              </h3>
              <p>
                {step.text}
              </p>
            </Reveal>)}
          </div>
        </div>
      </section>
      <ContactCTA />
    </>
  )
}
