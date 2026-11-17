import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SiteImage from './SiteImage'

export default function ProjectCard({ project, featured = false }) {
  return (
    <article className={`project-card${featured ? ' project-card--featured' : ''}`}>
      <Link
        className="project-card-image"
        to={`/projects/${project.slug}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <SiteImage
          src={project.image}
          alt={project.alt}
          width={1000}
          height={750}
        />
        <span className="sample-badge">Demonstration concept</span>
        <span className="image-arrow">
          <ArrowUpRight size={24} strokeWidth={1.5} />
        </span>
      </Link>
      <div className="project-card-body">
        <div>
          <p className="card-category">
            {project.category}
          </p>
          <h3>
            <Link to={`/projects/${project.slug}`}>
              {project.title}
              <ArrowUpRight size={21} aria-hidden="true" />
            </Link>
          </h3>
        </div>
        <p className="card-description">
          {project.description}
        </p>
      </div>
    </article>
  )
}
