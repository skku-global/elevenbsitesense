import SiteImage from './SiteImage'
import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

export default function ServiceImageGallery({ service }) {
  if (!service.gallery?.length) return null
  return (
    <section className="section service-visual-details">
      <div className="container">
        <SectionHeading eyebrow="THE DETAILS IN FOCUS" title={service.galleryTitle} description={service.galleryDescription || "Illustrative design references. Your ceiling layout and lighting specification are agreed for your particular room."} />
        <div className="service-detail-gallery">
          {service.gallery.map((image, index) => (
            <Reveal key={image.title}>
              <figure>
                <div className="service-detail-gallery-image">
                  <SiteImage src={image.image} alt={image.alt} fallbackSrc={image.fallbackSrc} fallbackAlt={image.fallbackAlt} fallbackLabel={image.fallbackLabel} position={image.position} caption={image.caption || "Ceiling design reference · Stock photograph"} mediaSubject={service.mediaSubject} width={1000} height={750} />
                </div>
                <figcaption><span className="sdg-index">{String(index + 1).padStart(2, '0')}</span><h3>{image.title}</h3><p>{image.description}</p></figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
