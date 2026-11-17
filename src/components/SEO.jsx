import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { company, getCompanySchema } from '../data/company'

export default function SEO({ title, description, noIndex = false }) {
  const { pathname } = useLocation()
  useEffect(() => {
    const pageTitle = `${title} | ${company.brandName}`
    const pageDescription = description.includes(company.brandName) ? description : `${company.brandName} — ${description}`
    const socialImage = new URL(company.socialImage, company.websiteUrl || window.location.origin).href
    const socialImageAlt = `${company.brandName} architectural wordmark. ${company.slogan}`
    document.title = pageTitle
    const setMeta = (attribute, name, content) => {
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }
    setMeta('name', 'description', pageDescription)
    setMeta('name', 'application-name', company.brandName)
    setMeta('name', 'robots', noIndex ? 'noindex, follow' : 'index, follow')
    setMeta('property', 'og:title', pageTitle)
    setMeta('property', 'og:description', pageDescription)
    setMeta('property', 'og:site_name', company.companyName)
    setMeta('property', 'og:type', 'website')
    setMeta('property', 'og:locale', 'en_NG')
    setMeta('property', 'og:image', socialImage)
    setMeta('property', 'og:image:alt', socialImageAlt)
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height', '630')
    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', pageTitle)
    setMeta('name', 'twitter:description', pageDescription)
    setMeta('name', 'twitter:image', socialImage)
    setMeta('name', 'twitter:image:alt', socialImageAlt)
    let organization = document.head.querySelector('#company-identity-schema')
    if (!organization) {
      organization = document.createElement('script')
      organization.id = 'company-identity-schema'
      organization.type = 'application/ld+json'
      document.head.appendChild(organization)
    }
    organization.textContent = JSON.stringify(getCompanySchema())
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (company.websiteUrl) {
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.rel = 'canonical'
        document.head.appendChild(canonical)
      }
      canonical.href = `${company.websiteUrl.replace(/\/$/, '')}${pathname}`
      setMeta('property', 'og:url', canonical.href)
    } else {
      canonical?.remove()
      document.head.querySelector('meta[property="og:url"]')?.remove()
    }
  }, [title, description, noIndex, pathname])
  return null
}
