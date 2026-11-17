// Official company identity. Keep all public company details in this file.
// Empty contact details deliberately prevent links to invented recipients.
export const company = {
  companyName: 'ELEVEN B SITE SENSE NIGERIA LIMITED',
  brandName: 'ELEVEN B SITE SENSE',
  legalSuffix: 'NIGERIA LIMITED',
  rcNumber: '7650068',
  registrationDate: 'July 04, 2024',
  registrationDateISO: '2024-07-04',
  registrationStatus: 'ACTIVE',
  socialImage: '/social-card.png',
  tagline: 'Built with purpose. Finished with pride.',
  phone: '',
  whatsapp: '', // International format, country code included, digits only.
  email: '',
  address: '',
  serviceArea: '',
  officeHours: '',
  websiteUrl: '',
  contactFormEndpoint: '', // HTTPS endpoint accepting JSON and returning a 2xx response.
  yearsExperience: null,
  completedProjects: null,
  teamSize: null,
}

export const companyFacts = [
  { value: company.yearsExperience, label: 'Years of experience' },
  { value: company.completedProjects, label: 'Completed projects' },
  { value: company.teamSize, label: 'Construction professionals' },
]

export function getWhatsAppUrl(message = `Hello ${company.brandName}, I would like to discuss a project.`) {
  const phone = company.whatsapp.replace(/\D/g, '')
  return /^\d{7,15}$/.test(phone)
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : null
}

export const contactPlaceholders = {
  phone: 'Company phone to be supplied',
  email: 'Company email to be supplied',
  address: 'Office address to be supplied',
  serviceArea: 'Service locations to be confirmed',
  officeHours: 'Office hours to be supplied',
}
