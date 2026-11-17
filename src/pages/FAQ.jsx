import { useState } from 'react'
import { Search, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PageIntro from '../components/PageIntro'
import FAQAccordion from '../components/FAQAccordion'
import ContactCTA from '../components/ContactCTA'
import SEO from '../components/SEO'
import Button from '../components/Button'
import { faqs } from '../data/faqs'

const categories = ['All questions', ...new Set(faqs.map((item) => item.category))]

export default function FAQ() {
  const [category, setCategory] = useState('All questions')
  const [query, setQuery] = useState('')
  const filtered = faqs.filter((item) => (category === 'All questions' || item.category === category) && `${item.question} ${item.answer}`.toLowerCase().includes(query.toLowerCase().trim()))
  return (
    <>
      <SEO
        title="Frequently asked questions"
        description="Answers to common questions about construction, project consultations, timelines, materials, swimming pools, interior finishes, quotations, and contacting the company."
      />
      <PageIntro
        eyebrow="A LITTLE CLARITY BEFORE YOU BEGIN"
        title={<>Good questions.<br /><em>Thoughtful answers.</em></>}
        description="Explore the practical details of planning a project, choosing materials, and working through the process."
        breadcrumbs={[{ label: 'Frequently asked questions' }]}
      />
      <section className="section faq-page">
        <div className="container faq-layout">
          <aside className="faq-sidebar">
            <p className="eyebrow">FIND YOUR ANSWER</p>
            <div className="faq-categories" role="group" aria-label="Filter questions by topic">
              {categories.map((item) => <button
                type="button"
                key={item}
                aria-pressed={category === item}
                className={category === item ? 'is-active' : ''}
                onClick={() => setCategory(item)}
              >
                {item}
                <ArrowUpRight size={15} aria-hidden="true" />
              </button>)}
            </div>
            <div className="faq-contact-card">
              <h2>Have something<br />else in mind?</h2>
              <p>Tell us about your project. A conversation can help make the next step clearer.</p>
              <Link className="text-link" to="/contact">Let’s talk<ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
          </aside>
          <div className="faq-content">
            <div className="faq-search">
              <Search size={19} strokeWidth={1.5} aria-hidden="true" />
              <label className="sr-only" htmlFor="faq-search">Search frequently asked questions</label>
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for a question or a topic…"
              />
            </div>
            <p className="faq-result-count" role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'question' : 'questions'}{category !== 'All questions' ? ` about ${category.toLowerCase()}` : ''}</p>
            {filtered.length ? <FAQAccordion key={category} items={filtered} /> : <div className="empty-state">
              <h2>No matching questions yet.</h2>
              <p>Try a different word, browse all topics, or send us an enquiry.</p>
              <Button variant="outline" onClick={() => { setCategory('All questions'); setQuery('') }}>View all questions</Button>
            </div>}
          </div>
        </div>
      </section>
      <ContactCTA title="A clearer plan starts with a conversation." />
    </>
  )
}
