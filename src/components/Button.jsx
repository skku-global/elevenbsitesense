import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Button({ children, to, href, variant = 'gold', icon = true, diagonal = false, className = '', ...props }) {
  const classes = `button button--${variant} ${className}`.trim()
  const Icon = diagonal ? ArrowUpRight : ArrowRight
  const content = <>
      {children}
      {icon && <Icon size={17} strokeWidth={1.7} aria-hidden="true" />}
    </>
  if (to) return <Link to={to} className={classes} {...props}>
      {content}
    </Link>
  if (href) return <a href={href} className={classes} {...props}>
      {content}
    </a>
  return <button type="button" className={classes} {...props}>
      {content}
    </button>
}
