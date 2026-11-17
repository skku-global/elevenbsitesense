import { useState } from 'react'
import { imageFallback } from '../data/media'

function ImageContent({ src, alt, className = '', eager = false, position, fallbackSrc = imageFallback, fallbackLabel = 'Architectural illustration', fallbackAlt, caption, mediaSubject, ...props }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(!src || src === fallbackSrc)
  const [unavailable, setUnavailable] = useState(false)
  const showCaption = Boolean(caption || (failed && fallbackSrc !== imageFallback))
  const primaryIllustration = src === fallbackSrc

  const handleError = () => {
    if (!failed) { setLoaded(false); setFailed(true) }
    else { setLoaded(true); setUnavailable(true) }
  }
  return (
    <span className={`site-image ${loaded ? 'is-loaded' : 'is-loading'}${failed ? ' is-fallback' : ''} ${className}`} data-media-subject={mediaSubject} data-image-source={failed ? 'illustration' : 'photograph'}>
      {unavailable ? <span className="image-unavailable" role="img" aria-label={`${fallbackLabel}. Image unavailable.`}><strong>{fallbackLabel}</strong><span>Image unavailable</span></span> : <img
        src={failed ? fallbackSrc : src}
        alt={failed ? (fallbackAlt || `${alt}. Architectural illustration shown while the photograph is unavailable.`) : alt}
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={eager ? 'high' : 'auto'}
        decoding="async"
        style={position ? { objectPosition: position } : undefined}
        onLoad={() => setLoaded(true)}
        onError={handleError}
        {...props}
      />}
      {showCaption && <span className="image-caption">{failed ? `${fallbackLabel} · ${primaryIllustration ? 'Design reference' : 'Photo unavailable'}` : caption}</span>}
    </span>
  )
}

export default function SiteImage(props) {
  return <ImageContent key={props.src} {...props} />
}
