import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import SiteImage from './SiteImage'
import Reveal from './Reveal'

export default function PageIntro({ eyebrow, title, description, image, alt, breadcrumbs = [], children, className = '', fallbackSrc, fallbackAlt, fallbackLabel, imagePosition, imageCaption = 'Architectural inspiration · Stock imagery', mediaSubject, media }) {
  return (
    <section className={`page-intro${image || media ? ' page-intro--image' : ''} ${className}`}>
      <div className="container page-intro-inner">
        <Reveal className="page-intro-copy">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            {breadcrumbs.map((crumb, index) => <span key={index}>
              <ArrowRight size={11} aria-hidden="true" />
              {crumb.to ? <Link to={crumb.to}>
                {crumb.label}
              </Link> : <span aria-current="page">
                {crumb.label}
              </span>}
            </span>)}
          </nav>
          <p className="eyebrow">
            {eyebrow}
          </p>
          <h1>
            {title}
          </h1>
          <p className="page-intro-description">
            {description}
          </p>
          {children}
        </Reveal>
        {media && <div className="page-intro-image page-intro-media">{media}</div>}
        {image && !media && <div className="page-intro-image">
          <SiteImage
            src={image}
            alt={alt}
            fallbackSrc={fallbackSrc}
            fallbackAlt={fallbackAlt}
            fallbackLabel={fallbackLabel}
            position={imagePosition}
            caption={imageCaption}
            mediaSubject={mediaSubject}
            eager
            width={1100}
            height={850}
          />
        </div>}
      </div>
    </section>
  )
}
