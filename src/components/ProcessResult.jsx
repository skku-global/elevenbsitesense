export default function ProcessResult({ service }) {
  return (
    <div className="process-result" data-media-subject={service.mediaSubject}>
      <figure className="pr-result">
        <img src={service.image} alt={service.alt} style={{ objectPosition: service.imagePosition }} fetchPriority="high" decoding="async" width={1400} height={930} />
        <figcaption className="pr-tag pr-tag--result"><span>02</span>The result</figcaption>
      </figure>
      <figure className="pr-process">
        <img src={service.processImage} alt={service.processAlt} decoding="async" width={1000} height={800} />
        <figcaption className="pr-tag"><span>01</span>The process</figcaption>
      </figure>
      <p className="pr-note">Illustrative images</p>
    </div>
  )
}
