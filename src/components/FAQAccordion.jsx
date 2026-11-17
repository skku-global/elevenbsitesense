import { useRef, useState } from 'react'
import { Plus, Minus } from 'lucide-react'

export default function FAQAccordion({ items, defaultOpen = null }) {
  const [openId, setOpenId] = useState(defaultOpen)
  const buttons = useRef([])
  const handleKeyDown = (event, index) => {
    let next
    if (event.key === 'ArrowDown') next = (index + 1) % items.length
    if (event.key === 'ArrowUp') next = (index - 1 + items.length) % items.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = items.length - 1
    if (next !== undefined) { event.preventDefault(); buttons.current[next]?.focus() }
  }
  return (
    <div className="faq-accordion">
      {items.map((item, index) => {
        const open = openId === item.id
        const Icon = open ? Minus : Plus
        return (
          <div className={`faq-item${open ? ' is-open' : ''}`} key={item.id}>
        <h3>
          <button
            type="button"
            id={`faq-button-${item.id}`}
            aria-expanded={open}
            aria-controls={`faq-panel-${item.id}`}
            ref={(element) => { buttons.current[index] = element }}
            onClick={() => setOpenId(open ? null : item.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          >
            <span>
              {item.question}
            </span>
            <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </h3>
        <div
          id={`faq-panel-${item.id}`}
          role="region"
          aria-labelledby={`faq-button-${item.id}`}
          className="faq-panel"
          hidden={!open}
        >
          <p>
            {item.answer}
          </p>
        </div>
      </div>
        )
      })}
    </div>
  )
}
