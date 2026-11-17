import { MessagesSquare } from 'lucide-react'
import TestimonialCard from './TestimonialCard'
import Button from './Button'
import { testimonials } from '../data/testimonials'

export default function ClientFeedback() {
  if (testimonials.length) return <div className="testimonials-grid">
    {testimonials.map((testimonial) => <TestimonialCard key={testimonial.id} testimonial={testimonial} />)}
  </div>

  return <div className="client-feedback-empty">
    <MessagesSquare size={34} strokeWidth={1.2} aria-hidden="true" />
    <div>
      <h3>A place for your experience.</h3>
      <p>Approved client testimonials will appear here when available. Worked with us? Share your feedback and discuss permission to publish it.</p>
    </div>
    <Button to="/contact" variant="outline" diagonal>Share your feedback</Button>
  </div>
}
