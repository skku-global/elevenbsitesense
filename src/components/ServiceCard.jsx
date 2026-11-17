import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import SiteImage from './SiteImage'

export default function ServiceCard({ service, index = 0 }) {
  return (
    <article className="service-card">
      <Link
        to={`/services/${service.slug}`}
        className="service-card-image"
        tabIndex={-1}
        aria-hidden="true"
      >
        <SiteImage
          src={service.image}
          alt={service.alt}
          fallbackSrc={service.fallbackSrc}
          fallbackAlt={service.fallbackAlt}
          fallbackLabel={service.fallbackLabel}
          position={service.imagePosition}
          mediaSubject={service.mediaSubject}
          width={720}
          height={540}
        />
        <span className="image-arrow">
          <ArrowUpRight size={21} strokeWidth={1.4} />
        </span>
      </Link>
      <div className="service-card-body">
        <p className="card-category"><span>
            {String(index + 1).padStart(2, '0')}
          </span> / {service.category}</p>
        <h3>
          <Link to={`/services/${service.slug}`}>
            {service.title}
          </Link>
        </h3>
        <p className="card-description">
          {service.description}
        </p>
        <Link className="text-link" to={`/services/${service.slug}`} aria-label={`Learn more about ${service.title}`}>Learn more <ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </article>
  )
}
