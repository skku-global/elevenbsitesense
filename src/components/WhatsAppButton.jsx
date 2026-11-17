import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import Button from './Button'
import { getWhatsAppUrl } from '../data/company'

function WhatsAppIcon() {
  return <svg
      viewBox="0 0 32 32"
      width="28"
      height="28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M27.2 15.6A11.2 11.2 0 0 1 10.7 25.5L4 27.5l2-6.4A11.2 11.2 0 1 1 27.2 15.6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m12.4 9.6 1.4 3.1-1.3 1.4c.9 2.3 2.6 4 4.8 4.8l1.5-1.5 3 1.5c.1 1.8-1.3 3-2.8 2.8-5.3-.7-9.7-5.2-10.2-9.5-.2-1.4 1.3-3 3.6-2.6Z"
        fill="currentColor"
      />
    </svg>
}

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false)
  const trigger = useRef(null)
  const wrapper = useRef(null)
  const url = getWhatsAppUrl()
  useEffect(() => {
    if (!open) return
    const onKey = (event) => { if (event.key === 'Escape') { setOpen(false); trigger.current?.focus() } }
    const onOutside = (event) => { if (!wrapper.current?.contains(event.target)) setOpen(false) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onOutside)
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onOutside) }
  }, [open])
  return (
    <div className="whatsapp-widget" ref={wrapper}>
      {open && <div
        className="whatsapp-panel"
        id="whatsapp-panel"
        role="region"
        aria-label="WhatsApp contact options"
      >
        <button
          type="button"
          className="whatsapp-close"
          aria-label="Close contact options"
          onClick={() => { setOpen(false); trigger.current?.focus() }}
        >
          <X size={19} />
        </button>
        <p className="eyebrow">LET’S CONNECT</p>
        <h2>A great project starts here.</h2>
        <p>Our WhatsApp number is awaiting confirmation. You can still prepare a project enquiry on our contact page.</p>
        <Button to="/contact" variant="navy">Prepare an enquiry</Button>
      </div>}
      {url ? <a
        href={url}
        className="whatsapp-trigger"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact the company on WhatsApp"
      >
        <WhatsAppIcon />
        <span className="whatsapp-tooltip">Chat on WhatsApp</span>
      </a> : <button
        ref={trigger}
        type="button"
        className="whatsapp-trigger"
        aria-label="WhatsApp contact options"
        aria-expanded={open}
        aria-controls="whatsapp-panel"
        onClick={() => setOpen(!open)}
      >
        <WhatsAppIcon />
        <span className="whatsapp-tooltip">Let’s talk</span>
      </button>}
    </div>
  )
}
