import { Info } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import ProjectCard from '../components/ProjectCard'
import ContactCTA from '../components/ContactCTA'
import SEO from '../components/SEO'
import Reveal from '../components/Reveal'
import { projects, projectCategories } from '../data/projects'
import { company } from '../data/company'
import { media } from '../data/media'

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedCategory = searchParams.get('category')
  const category = projectCategories.includes(requestedCategory) ? requestedCategory : 'All projects'
  const filteredProjects = category === 'All projects' ? projects : projects.filter((project) => project.category === category)
  return (
    <>
      <SEO
        title="Projects & inspiration"
        description="Explore clearly labelled demonstration concepts for residential buildings, interiors, swimming pools, and exterior finishes. Find inspiration for your next project."
      />
      <PageIntro
        eyebrow="PORTFOLIO & ARCHITECTURAL INSPIRATION"
        title={<>A vision of<br /><em>what’s possible.</em></>}
        description="Considered architecture. Inviting interiors. Beautiful outdoor living. A few ideas for the space you have in mind."
        image={media.residence}
        alt="Modern home with carefully composed architecture and outdoor spaces"
        breadcrumbs={[{ label: 'Projects' }]}
      />
      <section className="section portfolio-section">
        <div className="container">
          <Reveal>
            <div className="demo-notice">
              <Info size={21} strokeWidth={1.4} aria-hidden="true" />
              <div>
                <h2>A demonstration portfolio</h2>
                <p>These illustrative concepts use stock photography and do not represent completed {company.brandName} projects. Verified company work will be added when available.</p>
              </div>
            </div>
          </Reveal>
          <div className="project-filter-bar">
            <div className="project-filters" role="group" aria-label="Filter demonstration projects by category">
              {projectCategories.map((item) => <button
                key={item}
                type="button"
                className={category === item ? 'is-active' : ''}
                aria-pressed={category === item}
                onClick={() => setSearchParams(item === 'All projects' ? {} : { category: item }, { replace: true })}
              >
                {item}
              </button>)}
            </div>
            <p role="status" aria-live="polite">{filteredProjects.length} demonstration {filteredProjects.length === 1 ? 'concept' : 'concepts'}</p>
          </div>
          <div className="projects-grid">
            {filteredProjects.map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </div>
      </section>
      <ContactCTA title="Inspired by what you see? Let’s talk about your vision." />
    </>
  )
}
