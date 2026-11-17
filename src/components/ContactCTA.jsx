import Button from './Button'
import Reveal from './Reveal'

export default function ContactCTA({ eyebrow = 'YOUR NEXT CHAPTER', title = 'Something remarkable starts with a conversation.', description = 'A new home, an inspired interior, a better outdoor space. Tell us what you have in mind.', to = '/contact', buttonLabel = 'Let’s discuss your project' }) {
  return (
    <section className="contact-cta section">
      <div className="container">
        <Reveal className="contact-cta-inner">
          <div>
            <p className="eyebrow">
              {eyebrow}
            </p>
            <h2>
              {title}
            </h2>
            <p>
              {description}
            </p>
          </div>
          <Button to={to} diagonal>{buttonLabel}</Button>
          <span className="cta-architecture" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  )
}
