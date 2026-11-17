import { company, getWhatsAppUrl } from '../data/company'

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
  return (
    <div className="whatsapp-widget">
      <a
        href={getWhatsAppUrl()}
        className="whatsapp-trigger"
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${company.contactPerson} at ${company.brandName} on WhatsApp`}
      >
        <WhatsAppIcon />
        <span className="whatsapp-tooltip">Chat on WhatsApp</span>
      </a>
    </div>
  )
}
