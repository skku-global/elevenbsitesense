import { company } from '../data/company'
import OfficeAddress from './OfficeAddress'

export default function CompanyRegistration({ compact = false, showAddress = false }) {
  return (
    <div className={`company-registration${compact ? ' company-registration--compact' : ''}`}>
      <div className="company-registration-heading">
        <p className="eyebrow">REGISTERED COMPANY</p>
        <h3>{company.companyName}</h3>
      </div>
      <dl className="registration-details">
        <div>
          <dt>RC number</dt>
          <dd>RC {company.rcNumber}</dd>
        </div>
        <div>
          <dt>Registration date</dt>
          <dd><time dateTime={company.registrationDateISO}>{company.registrationDate}</time></dd>
        </div>
        <div>
          <dt>Registration status</dt>
          <dd><span className="registration-status">{company.registrationStatus}</span></dd>
        </div>
      </dl>
      {showAddress && <div className="registration-office">
        <p className="small-label">OUR OFFICE</p>
        <OfficeAddress />
      </div>}
    </div>
  )
}
