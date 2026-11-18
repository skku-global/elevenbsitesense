import { useEffect, useRef, useState } from 'react'
import { Check, CheckCircle2, Download, Info, LoaderCircle, Mail, MessageCircle, RotateCcw, Send } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import Button from './Button'
import { company, getEmailUrl, getWhatsAppUrl } from '../data/company'
import { getService, services } from '../data/services'
import { getProject } from '../data/projects'

function validate(values) {
  const errors = {}
  if (values.name.trim().length < 2) errors.name = 'Please enter your full name (at least 2 characters).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = 'Please enter a valid email address.'
  if (values.phone.trim() && (!/^[+\d\s().-]+$/.test(values.phone) || !/^\d{7,15}$/.test(values.phone.replace(/\D/g, '')))) errors.phone = 'Please enter a valid phone number with 7–15 digits.'
  if (!services.some((service) => service.slug === values.service) && values.service !== 'not-sure') errors.service = 'Please select a service, or choose “Multiple services / not sure yet”.'
  if (values.message.trim().length < 20) errors.message = 'Please tell us a little more about your project (at least 20 characters).'
  return errors
}

export default function ContactForm() {
  const [searchParams] = useSearchParams()
  const selectedService = getService(searchParams.get('service'))?.slug || ''
  const selectedProject = getProject(searchParams.get('project'))
  const initialValues = () => ({ name: '', email: '', phone: '', service: selectedService, message: selectedProject ? `I’m interested in a project inspired by the ${selectedProject.title} demonstration concept. My project details are: ` : '' })
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const formRef = useRef(null)
  const statusRef = useRef(null)
  const requestRef = useRef(null)
  const live = Boolean(company.contactFormEndpoint)

  useEffect(() => () => requestRef.current?.abort(), [])
  useEffect(() => { if (status === 'success' || status === 'preview') statusRef.current?.focus({ preventScroll: true }) }, [status])

  const update = (event) => {
    const { name, value } = event.target
    setValues((previous) => ({ ...previous, [name]: value }))
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: undefined }))
    if (status === 'error') { setStatus('idle'); setFeedback('') }
  }

  const submit = async (event) => {
    event.preventDefault()
    if (submitting) return
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) {
      setStatus('error')
      setFeedback('Please check the highlighted fields so we can prepare your enquiry.')
      formRef.current?.elements.namedItem(Object.keys(nextErrors)[0])?.focus()
      return
    }
    if (!live) { setStatus('preview'); return }
    setSubmitting(true)
    setStatus('idle')
    const controller = new AbortController()
    requestRef.current = controller
    const timer = window.setTimeout(() => controller.abort(), 15000)
    try {
      const response = await fetch(company.contactFormEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...values, name: values.name.trim(), email: values.email.trim(), phone: values.phone.trim(), message: values.message.trim(), serviceTitle: getService(values.service)?.title || 'Multiple services / not sure yet', source: company.companyName }),
        signal: controller.signal,
      })
      if (!response.ok) throw new Error('Submission unsuccessful')
      setStatus('success')
    } catch (error) {
      setStatus('error')
      setFeedback(error.name === 'AbortError' ? 'The request took too long. Your details are still here. Please try again or use a verified direct contact option.' : 'We couldn’t send your enquiry. Your details are still here. Please try again or use a verified direct contact option.')
    } finally {
      window.clearTimeout(timer)
      requestRef.current = null
      setSubmitting(false)
    }
  }

  const enquiryText = () => {
    const service = getService(values.service)?.title || 'Multiple services / not sure yet'
    return `Hello ${company.contactPerson},\nI would like to discuss a project with ${company.brandName}.\n\nName: ${values.name.trim()}\nEmail: ${values.email.trim()}\nPhone: ${values.phone.trim() || 'Not supplied'}\nService: ${service}\n\nProject details:\n${values.message.trim()}\n`
  }

  const download = () => {
    const contents = `${company.companyName}\nRC ${company.rcNumber}\nPROJECT ENQUIRY — PERSONAL COPY\n\nThis is a prepared enquiry. It has not been sent to the company.\n\n${enquiryText()}`
    const url = URL.createObjectURL(new Blob([contents], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${company.brandName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-project-enquiry.txt`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const reset = () => { setValues(initialValues()); setErrors({}); setStatus('idle'); setFeedback('') }
  const description = (name) => errors[name] ? `${name}-error` : undefined
  return (
    <div className="contact-form-card" id="project-enquiry">
      <div className="contact-form-heading">
        <p className="eyebrow">TELL US WHAT YOU HAVE IN MIND</p>
        <h2>Your next project starts here.</h2>
        <p>A few details will help shape the first conversation.</p>
      </div>
      {(status === 'preview' || status === 'success') ? (
        <div
        className="form-success"
        role="status"
        aria-live="polite"
        ref={statusRef}
        tabIndex={-1}
      >
        <span className="success-icon">
          <CheckCircle2 size={32} strokeWidth={1.4} aria-hidden="true" />
        </span>
        <h3>
          {status === 'preview' ? 'Your project brief is ready.' : 'Thank you. Your enquiry has been sent.'}
        </h3>
        <p>
          {status === 'preview' ? 'Your details are ready; nothing has been sent yet. Open your enquiry in your email app, review it and press Send there, or download a copy to share. You can also start a conversation on our official WhatsApp number.' : 'Your enquiry was accepted by our submission service. The company can use the contact details you supplied to discuss the next steps.'}
        </p>
        <dl className="enquiry-summary">
          <div>
            <dt>Name</dt>
            <dd>
              {values.name}
            </dd>
          </div>
          <div>
            <dt>Service</dt>
            <dd>
              {getService(values.service)?.title || 'Multiple services / not sure yet'}
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              {values.email}
            </dd>
          </div>
          {values.phone && <div>
            <dt>Phone</dt>
            <dd>
              {values.phone}
            </dd>
          </div>}
        </dl>
        <div className="form-success-actions">
          {status === 'preview' && <>
            <Button href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer" variant="navy" icon={false}><MessageCircle size={16} aria-hidden="true" />Chat on WhatsApp</Button>
            <Button href={getEmailUrl(`Project enquiry — ${getService(values.service)?.title || 'Multiple services'}`, enquiryText())} variant="outline" icon={false}><Mail size={16} aria-hidden="true" />Open in email</Button>
            <Button variant="outline" icon={false} onClick={download}><Download size={16} aria-hidden="true" />Download enquiry</Button>
          </>}
          {status === 'preview' ? <Button variant="outline" icon={false} onClick={() => setStatus('idle')}>Edit enquiry</Button> : <Button variant="outline" icon={false} onClick={reset}><RotateCcw size={16} aria-hidden="true" />Start another enquiry</Button>}
        </div>
        {status === 'preview' && <button type="button" className="reset-enquiry" onClick={reset}>Start a new enquiry</button>}
      </div>
      ) : (
        <form
        ref={formRef}
        onSubmit={submit}
        noValidate
        aria-label="Project enquiry"
        aria-busy={submitting}
      >
        {!live && <div className="form-mode-note">
          <Info size={17} aria-hidden="true" />
          <p><strong>Prepare your project brief.</strong> Review your details, then email or download the brief. You can also chat with {company.contactPerson} on our official WhatsApp number.</p>
        </div>}
        {status === 'error' && <p className="form-feedback form-feedback--error" role="alert">
          {feedback}
        </p>}
        <fieldset disabled={submitting}>
          <legend className="sr-only">Your contact details and project requirements</legend>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="contact-name">Full name <span aria-hidden="true">*</span></label>
              <input
                id="contact-name"
                name="name"
                value={values.name}
                onChange={update}
                placeholder="Your full name"
                autoComplete="name"
                required
                maxLength={100}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={description('name')}
              />
              {errors.name && <p className="field-error" id="name-error">
                {errors.name}
              </p>}
            </div>
            <div className="form-field">
              <label htmlFor="contact-email">Email address <span aria-hidden="true">*</span></label>
              <input
                id="contact-email"
                name="email"
                type="email"
                value={values.email}
                onChange={update}
                placeholder="Your email address"
                autoComplete="email"
                required
                maxLength={254}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={description('email')}
              />
              {errors.email && <p className="field-error" id="email-error">
                {errors.email}
              </p>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="contact-phone">Phone number <span className="optional-label">(optional)</span></label>
              <input
                id="contact-phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={update}
                placeholder="Your contact number"
                autoComplete="tel"
                maxLength={30}
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={description('phone')}
              />
              {errors.phone && <p className="field-error" id="phone-error">
                {errors.phone}
              </p>}
            </div>
            <div className="form-field">
              <label htmlFor="contact-service">Service of interest <span aria-hidden="true">*</span></label>
              <select
                id="contact-service"
                name="service"
                value={values.service}
                onChange={update}
                required
                aria-invalid={Boolean(errors.service)}
                aria-describedby={description('service')}
              >
                <option value="">Select a service</option>
                {services.map((service) => <option key={service.slug} value={service.slug}>
                  {service.title}
                </option>)}
                <option value="not-sure">Multiple services / not sure yet</option>
              </select>
              {errors.service && <p className="field-error" id="service-error">
                {errors.service}
              </p>}
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="contact-message">Tell us about your project <span aria-hidden="true">*</span></label>
            <textarea
              id="contact-message"
              name="message"
              value={values.message}
              onChange={update}
              rows={6}
              minLength={20}
              maxLength={3000}
              required
              placeholder="Your ideas, project location, approximate scope, and any questions you have…"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? 'message-error message-help' : 'message-help'}
            />
            {errors.message && <p className="field-error" id="message-error">
              {errors.message}
            </p>}
            <p className="field-help" id="message-help">At least 20 characters <span>{values.message.length}/3000</span></p>
          </div>
          <div className="form-submit-row">
            <Button
              type="submit"
              variant="navy"
              disabled={submitting}
              icon={false}
            >
              {submitting ? <><LoaderCircle size={17} className="spin" aria-hidden="true" />Sending enquiry…</> : <>
                {live ? 'Send enquiry' : 'Prepare my enquiry'}
                <Send size={16} strokeWidth={1.5} aria-hidden="true" />
              </>}
            </Button>
            <p><Check size={13} aria-hidden="true" />Used only to discuss your enquiry.</p>
          </div>
        </fieldset>
        <p className="form-required-note">Fields marked * are required. {live ? 'Your details are sent when you submit.' : 'Your details stay on this page until you choose a sharing or download option.'}</p>
      </form>
      )}
    </div>
  )
}
