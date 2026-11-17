import { Quote } from 'lucide-react'

export default function TestimonialCard({ testimonial }) {
  return (
    <article className="testimonial-card">
      <div className="testimonial-card-top">
        <Quote size={28} strokeWidth={1.2} aria-hidden="true" />
        <span className="sample-label">Client feedback</span>
      </div>
      <blockquote>
        <p>
          {testimonial.quote}
        </p>
      </blockquote>
      <div className="testimonial-author">
        <span className="testimonial-number" aria-hidden="true">
          {testimonial.initials}
        </span>
        <div>
          <p>
            {testimonial.label}
          </p>
          <span>
            {testimonial.context}
          </span>
        </div>
      </div>
    </article>
  )
}
