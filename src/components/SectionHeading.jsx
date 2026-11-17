export default function SectionHeading({ eyebrow, title, description, children, center = false, className = '' }) {
  return (
    <div className={`section-heading${center ? ' section-heading--center' : ''} ${className}`}>
      <div className="section-heading-main">
        {eyebrow && <p className="eyebrow">
          {eyebrow}
        </p>}
        <h2>
          {title}
        </h2>
      </div>
      {(description || children) && <div className="section-heading-aside">
        {description && <p>
          {description}
        </p>}
        {children}
      </div>}
    </div>
  )
}
