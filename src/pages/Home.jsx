import { Link } from 'react-router-dom'
import { Check, Phone } from 'lucide-react'
import SEO from '../components/SEO'
import Reveal from '../components/Reveal'
import { company, getWhatsAppUrl } from '../data/company'
import '../styles/home-pool.css'
import TikTokVideo from '../components/TikTokVideo'
import { tiktokVideos, TIKTOK_PROFILE as TIKTOK } from '../data/tiktok'

import heroImg from '../assets/images/pool/hero-ai.webp'
import curvedImg from '../assets/images/pool/gallery-curved-mosaic.webp'
import mosaicImg from '../assets/images/pool/step-mosaic.webp'
import digImg from '../assets/images/pool/step-excavation.webp'
import shellImg from '../assets/images/pool/step-structure.webp'
import ownDeck from '../assets/images/projects/swimming-pool-tiled-deck.webp'
import ownJacuzzi from '../assets/images/projects/pool-and-jacuzzi.webp'
import oBuild from '../assets/images/construction/result-villa.webp'
import oLock from '../assets/images/interlock/result-driveway.webp'
import oTile from '../assets/images/tiling/result-hall.webp'
import oPop from '../assets/images/ceiling/result-living.webp'
import oPaint from '../assets/images/painting/result-living.webp'
import oInt from '../assets/images/interior/result-lounge.webp'

const POOL = '/services/swimming-pool-construction'
const waPool = getWhatsAppUrl(`Hello ${company.contactPerson}, I saw your website and I'm interested in a swimming pool.`)
const waService = getWhatsAppUrl(`Hello ${company.contactPerson}, I'd like to book pool maintenance or a repair.`)

function WaIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.6 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.2.1-1.9-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3.1s.8-2.2 1-2.5c.3-.3.6-.4.8-.4h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.4z"/></svg>
}

const trust = [
  ['10+', 'Years building pools'],
  ['50+', 'Pools completed'],
  ['CAC', 'Registered company'],
  ['Nationwide', 'Lagos · Ibadan · Abuja & more'],
]

const projects = [
  { img: ownDeck, own: true, meta: 'Residential · Ibadan', title: 'Family pool with tiled deck' },
  { img: ownJacuzzi, own: true, meta: 'Residential', title: 'Pool with built-in jacuzzi' },
  { img: curvedImg, own: false, meta: 'Mosaic finish', title: 'Curved mosaic pool' },
]

const poolServices = [
  { title: 'New Pools', text: 'Custom pools designed around your home and budget.', items: ['Design & layout', 'Excavation & structure', 'Plumbing & filtration', 'Mosaic tiling & lighting'] },
  { title: 'Maintenance', text: 'Keep your water clear, safe and ready all year.', items: ['Weekly or monthly visits', 'Water testing & balancing', 'Cleaning & vacuuming', 'Equipment checks'] },
  { title: 'Repair & Renovation', text: 'Bring an old or leaking pool back to life.', items: ['Leak detection & repair', 'Re-tiling & resurfacing', 'Pump & filter servicing', 'Lighting upgrades'] },
]

const steps = [
  { img: digImg, title: 'Design & excavation', text: 'Site visit, design and quote, then the pool is dug to shape.' },
  { img: shellImg, title: 'Structure & plumbing', text: 'Reinforced concrete shell with pipes, inlets and lights built in.' },
  { img: mosaicImg, title: 'Waterproofing & tiling', text: 'Sealed and finished in mosaic tiles with clean lines.' },
  { img: ownDeck, title: 'Fill & handover', text: 'Filled, tested and handed over, ready to swim.' },
]


const others = [
  { img: oBuild, title: 'Building', to: '/services/general-building-contracting' },
  { img: oLock, title: 'Interlock', to: '/services/interlock-paving' },
  { img: oTile, title: 'Tiling', to: '/services/tiling' },
  { img: oPop, title: 'P.O.P. Ceiling', to: '/services/pop-ceiling-installation' },
  { img: oPaint, title: 'Painting', to: '/services/painting' },
  { img: oInt, title: 'Interior', to: '/services/artwork-and-interior-design' },
]



export default function Home() {
  return (
    <div className="ph">
      <SEO
        title="Luxury Swimming Pools: Construction, Maintenance & Repair"
        description={`${company.brandName} designs, builds, maintains and repairs swimming pools for homes, hotels and estates across Nigeria. Chat on WhatsApp or request a free quote.`}
      />

      <section className="ph-hero" aria-labelledby="home-heading">
        <img src={heroImg} alt="Modern villa with a large turquoise mosaic swimming pool at sunset" fetchPriority="high" />
        <div className="ph-wrap">
          <p className="ph-eyebrow ph-eyebrow--light">Swimming pool specialists · Nigeria</p>
          <h1 id="home-heading">Luxury Swimming Pools,<br /><em>Built to Last.</em></h1>
          <p className="ph-hero-text">We design, build, maintain and repair swimming pools for homes, hotels and estates, from the first drawing to the first swim.</p>
          <div className="ph-actions">
            {waPool && <a className="ph-btn ph-btn--wa" href={waPool} target="_blank" rel="noreferrer"><WaIcon />Chat on WhatsApp</a>}
            <Link className="ph-btn ph-btn--line" to="/contact">Request a Free Quote →</Link>
          </div>
        </div>
      </section>

      <div className="ph-trust"><div className="ph-wrap">
        {trust.map(([b, t]) => <div key={t}><b>{b}</b><span>{t}</span></div>)}
      </div></div>

      <section className="ph-sec"><div className="ph-wrap">
        <div className="ph-head">
          <div><p className="ph-eyebrow">Our pool projects</p><h2>Real pools.<br /><em>Real clients.</em></h2></div>
          <Link to="/projects">See all projects →</Link>
        </div>
        <div className="ph-projects">
          {projects.map((p) => <Link className="ph-proj" to={POOL} key={p.title}>
            <img src={p.img} alt={p.title} loading="lazy" />
            {p.own && <span className="ph-badge">Our work</span>}
            <div className="ph-cap"><div className="ph-meta">{p.meta}</div><h3>{p.title}</h3></div>
          </Link>)}
        </div>
      </div></section>

      <section className="ph-sec ph-sand"><div className="ph-wrap">
        <div className="ph-head"><div><p className="ph-eyebrow">Pool services</p><h2>Everything your pool needs,<br /><em>in one place.</em></h2></div></div>
        <div className="ph-svc">
          {poolServices.map((s, i) => <Reveal className="ph-card" key={s.title} delay={i * 0.06}>
            <span className="ph-num">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <ul>{s.items.map((it) => <li key={it}><Check size={16} strokeWidth={2.5} aria-hidden="true" />{it}</li>)}</ul>
          </Reveal>)}
        </div>
        <div className="ph-actions ph-actions--dark">
          <Link className="ph-btn ph-btn--gold" to={POOL}>See how we build pools →</Link>
          {waService && <a className="ph-btn ph-btn--outline" href={waService} target="_blank" rel="noreferrer">Book maintenance or repair</a>}
        </div>
      </div></section>

      <section className="ph-sec"><div className="ph-wrap">
        <div className="ph-head"><div><p className="ph-eyebrow">How we build your pool</p><h2>Four clear steps,<br /><em>no surprises.</em></h2></div></div>
        <div className="ph-steps">
          {steps.map((s, i) => <div className="ph-step" key={s.title}>
            <img src={s.img} alt={s.title} loading="lazy" />
            <b>{String(i + 1).padStart(2, '0')}</b>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
          </div>)}
        </div>
      </div></section>

      <section className="ph-sec ph-navy"><div className="ph-wrap">
        <div className="ph-head">
          <div><p className="ph-eyebrow ph-eyebrow--aqua">Watch our work</p><h2>See it <em>for yourself.</em></h2></div>
          <a href={TIKTOK} target="_blank" rel="noreferrer">@elevenbsitesense on TikTok →</a>
        </div>
        <div className="ph-reels">
          {tiktokVideos.slice(0, 4).map((id) => <TikTokVideo id={id} key={id} />)}
        </div>
        <div className="ph-actions ph-actions--dark">
          <Link className="ph-btn ph-btn--gold" to="/projects#videos">Watch all {tiktokVideos.length} project videos →</Link>
        </div>
      </div></section>

      <section className="ph-sec"><div className="ph-wrap">
        <div className="ph-head"><div><p className="ph-eyebrow">We also build</p><h2>Other <em>services.</em></h2></div><Link to="/services">All services →</Link></div>
        <div className="ph-others">
          {others.map((o) => <Link className="ph-other" to={o.to} key={o.title}>
            <img src={o.img} alt={o.title} loading="lazy" />
            <h3>{o.title}</h3>
          </Link>)}
        </div>
      </div></section>

      <section className="ph-sec ph-cta"><div className="ph-wrap">
        <p className="ph-eyebrow ph-eyebrow--light">Start your pool</p>
        <h2>Ready for your <em>dream pool?</em></h2>
        <p className="ph-cta-text">Tell us about your space. We'll visit, advise and send a clear quote, in Nigeria or while you're abroad.</p>
        <div className="ph-actions ph-actions--center">
          {waPool && <a className="ph-btn ph-btn--wa" href={waPool} target="_blank" rel="noreferrer"><WaIcon />Chat on WhatsApp</a>}
          <Link className="ph-btn ph-btn--gold" to="/contact">Request a Free Quote →</Link>
        </div>
        <div className="ph-phones">
          {company.phoneNumbers.map((p) => <a key={p.number} href={`tel:+${p.international}`}><Phone size={16} aria-hidden="true" />{p.number}</a>)}
        </div>
      </div></section>
    </div>
  )
}
