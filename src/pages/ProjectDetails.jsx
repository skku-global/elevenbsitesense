import { ArrowLeft, ArrowRight, ArrowUpRight, Check, Info } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import SiteImage from '../components/SiteImage'
import SectionHeading from '../components/SectionHeading'
import ProjectCard from '../components/ProjectCard'
import ContactCTA from '../components/ContactCTA'
import Reveal from '../components/Reveal'
import SEO from '../components/SEO'
import NotFound from './NotFound'
import { getProject, projects } from '../data/projects'
import { getService } from '../data/services'

export default function ProjectDetails() {
  const { slug } = useParams()
  const project = getProject(slug)
  if (!project) return <NotFound type="project" />
  const related = [...projects.filter((item) => item.slug !== slug && item.category === project.category), ...projects.filter((item) => item.slug !== slug && item.category !== project.category)].slice(0, 3)
  return (
    <>
      <SEO
        title={`${project.title} — demonstration concept`}
        description={`${project.description} An illustrative ${project.category.toLowerCase()} concept using stock imagery; not a completed company project.`}
      />
      <section className="project-detail-header">
        <div className="container">
          <Reveal>
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <ArrowRight size={11} aria-hidden="true" />
              <Link to="/projects">Projects</Link>
              <ArrowRight size={11} aria-hidden="true" />
              <span aria-current="page">
                {project.title}
              </span>
            </nav>
            <div className="project-title-row">
              <div>
                <p className="eyebrow">{project.category.toUpperCase()} / DEMONSTRATION CONCEPT</p>
                <h1>
                  {project.title}
                </h1>
              </div>
              <p>
                {project.description}
              </p>
            </div>
          </Reveal>
          <div className="project-cover">
            <SiteImage
              src={project.image}
              alt={project.alt}
              eager
              width={1800}
              height={1000}
            />
            <span className="image-caption">Stock photography · Demonstration concept</span>
          </div>
        </div>
      </section>
      <section className="section project-story">
        <div className="container">
          <div className="project-facts">
            <div>
              <span>PROJECT CATEGORY</span>
              <p>
                {project.category}
              </p>
            </div>
            <div>
              <span>PROJECT STATUS</span>
              <p>Illustrative concept</p>
            </div>
            <div>
              <span>PHOTOGRAPHY</span>
              <p>Curated stock imagery</p>
            </div>
            <div>
              <span>COMMISSION</span>
              <p>Demonstration only</p>
            </div>
          </div>
          <div className="demo-notice">
            <Info size={20} strokeWidth={1.4} aria-hidden="true" />
            <div>
              <h2>For inspiration, with transparency.</h2>
              <p>This is a sample design direction, not a completed company commission. No client, location, cost, or completion date is being claimed.</p>
            </div>
          </div>
          <div className="project-story-grid">
            <Reveal>
              <p className="eyebrow">THE CONCEPT</p>
              <h2>A considered vision<br />for the whole space.</h2>
              <div className="prose">
                <p>
                  {project.concept}
                </p>
                <p>
                  {project.brief}
                </p>
              </div>
            </Reveal>
            <Reveal className="project-highlights">
              <p className="eyebrow">DETAILS TO EXPLORE</p>
              <ul className="check-list">
                {project.highlights.map((highlight) => <li key={highlight}>
                  <Check size={17} aria-hidden="true" />
                  {highlight}
                </li>)}
              </ul>
              <div className="project-service-list">
                <h3>Relevant expertise</h3>
                {project.services.map(getService).filter(Boolean).map((service) => <Link to={`/services/${service.slug}`} key={service.slug}>
                  {service.title}
                  <ArrowUpRight size={15} aria-hidden="true" />
                </Link>)}
              </div>
            </Reveal>
          </div>
          <div className="project-detail-gallery">
            {project.gallery.map((src, index) => <Reveal key={src}>
              <figure>
                <SiteImage
                  src={src}
                  alt={project.galleryAlts[index]}
                  width={1000}
                  height={800}
                />
                <figcaption>{project.galleryAlts[index]} · Stock photography</figcaption>
              </figure>
            </Reveal>)}
          </div>
        </div>
      </section>
      <section className="section related-section">
        <div className="container">
          <SectionHeading eyebrow="MORE POSSIBILITIES" title="Explore another direction.">
            <Link className="text-link" to="/projects">All concepts<ArrowUpRight size={17} aria-hidden="true" /></Link>
          </SectionHeading>
          <div className="projects-grid">
            {related.map((item) => <ProjectCard key={item.slug} project={item} />)}
          </div>
          <Link to="/projects" className="back-link"><ArrowLeft size={17} aria-hidden="true" />Back to the portfolio</Link>
        </div>
      </section>
      <ContactCTA title="Let’s create a direction that is entirely your own." to={`/contact?project=${project.slug}`} />
    </>
  )
}
