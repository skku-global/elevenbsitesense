import { Check, Layers3, MessagesSquare, Ruler, Sparkles } from 'lucide-react'
import PageIntro from '../components/PageIntro'
import SectionHeading from '../components/SectionHeading'
import SiteImage from '../components/SiteImage'
import ContactCTA from '../components/ContactCTA'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import CompanyRegistration from '../components/CompanyRegistration'
import { company, companyFacts } from '../data/company'
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
        description="Thoughtful buildings. Beautiful finishes. A considered approach to the spaces that matter to you."
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
              <p>It is about creating a place that feels right for the people who use it. At {company.companyName}, our focus brings together practical construction and the finishing details that give a space its character.</p>
              <p>Our service range spans general building, swimming pools, P.O.P. ceilings, interiors and artwork, tiling, paving, stamped finishes, and painting. Whether you are starting from the ground up or rethinking an existing space, we help connect the different parts of your vision.</p>
              <p>We believe in defining the brief clearly, selecting materials with purpose, and keeping design decisions connected to the realities of the build.</p>
            </Reveal>
          </div>
          <Reveal>
            <CompanyRegistration />
          </Reveal>
        </div>
      </section>
      <section className="mission-section section">
        <div className="container">
          <div className="mission-grid">
            <Reveal className="mission-card">
              <span className="large-index">01</span>
              <p className="eyebrow">OUR MISSION</p>
              <h2>Make your vision<br />a place to live.</h2>
              <p>To bring construction, design, and finishing together through thoughtful planning and careful execution, creating spaces that serve their purpose beautifully.</p>
            </Reveal>
            <Reveal className="mission-card" delay={0.08}>
              <span className="large-index">02</span>
              <p className="eyebrow">OUR VISION</p>
              <h2>Build better.<br />Finish thoughtfully.</h2>
              <p>To be a trusted choice for people who value a considered approach to their property, where clear communication and attention to detail shape every stage.</p>
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
            <p className="eyebrow">WHY CHOOSE OUR APPROACH</p>
            <h2>One vision.<br />A world of considered details.</h2>
            <p>A project works best when its many parts work together. Our range of construction and finishing services helps you approach the whole space with a clear direction.</p>
            <ul className="check-list">
              <li><Check size={17} aria-hidden="true" />Coordinated building and finishing services</li>
              <li><Check size={17} aria-hidden="true" />Material choices discussed around your priorities</li>
              <li><Check size={17} aria-hidden="true" />A clearly defined scope before work begins</li>
              <li><Check size={17} aria-hidden="true" />Attention to function as well as appearance</li>
            </ul>
            <div className="company-facts">
              <p className="company-facts-label">PROJECT & TEAM DETAILS · AWAITING VERIFIED INFORMATION</p>
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
