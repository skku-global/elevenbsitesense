import { Link } from 'react-router-dom'
import { company } from '../data/company'

export default function Logo({ light = false }) {
  return (
    <Link to="/" className={`brand${light ? ' brand--light' : ''}`} aria-label={`${company.companyName} home`}>
      <svg
        className="brand-mark"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        aria-hidden="true"
      >
        <path d="M7 40V15L22 7v33M22 40V23l19-10v27H7" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="miter" />
        <path d="M14 19v21M31 18v22M7 32h34" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      <span className="brand-wordmark">
        <strong>
          {company.brandName}
        </strong>
        <span>
          {company.legalSuffix}
        </span>
      </span>
    </Link>
  )
}
