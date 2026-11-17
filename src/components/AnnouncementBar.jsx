import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { company } from '../data/company'

export default function AnnouncementBar() {
  return (
    <div className="topbar">
      <div className="container">
        <span>{company.slogan}</span>
        <Link to="/contact">Your vision starts here <ArrowUpRight size={13} aria-hidden="true" /></Link>
      </div>
    </div>
  )
}
