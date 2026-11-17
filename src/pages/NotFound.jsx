import { useLocation } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import SEO from '../components/SEO'

export default function NotFound({ type = 'page' }) {
  const { pathname } = useLocation()
  return (
    <>
      <SEO
        title="Page not found"
        description="This page could not be found. Return to the homepage or explore our construction services and project inspiration."
        noIndex
      />
      <section className="not-found">
        <div className="container not-found-inner">
          <div className="not-found-drawing" aria-hidden="true">
            <span>404</span>
            <svg viewBox="0 0 400 190" fill="none">
              <path
                d="M30 180V72L200 15l170 57v108H30Zm0-108 170 63 170-63M200 15v165M85 180V99m230 81V99M140 180v-61m120 61v-61M30 150h340"
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </div>
          <div>
            <p className="eyebrow">A SMALL DETOUR</p>
            <h1>This {type} is<br /><em>still off the plan.</em></h1>
            <p>We couldn’t find the {type} at <span className="missing-path">
                {pathname}
              </span>. There’s plenty more to explore.</p>
            <div className="not-found-actions">
              <Button to="/">Back to home</Button>
              <Button to="/services" variant="outline">Explore services</Button>
            </div>
            <Link className="text-link" to="/contact">Need a hand? Get in touch<ArrowUpRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>
      </section>
    </>
  )
}
