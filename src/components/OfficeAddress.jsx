import { company } from '../data/company'

export default function OfficeAddress({ className = '' }) {
  return (
    <address className={`office-address ${className}`.trim()}>
      {company.addressLines.map((line) => <span key={line}>{line}</span>)}
    </address>
  )
}
