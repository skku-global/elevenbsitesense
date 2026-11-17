import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { lazy } from 'react'
import { MotionConfig } from 'framer-motion'
import SiteLayout from './components/SiteLayout'
import Home from './pages/Home'
import './styles/global.css'
import './styles/components.css'
import './styles/pages.css'
import './styles/service-details.css'
import './styles/branding.css'

const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const ServiceDetails = lazy(() => import('./pages/ServiceDetails'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetails = lazy(() => import('./pages/ProjectDetails'))
const Testimonials = lazy(() => import('./pages/Testimonials'))
const FAQ = lazy(() => import('./pages/FAQ'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user">
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="services" element={<Services />} />
            <Route path="services/:slug" element={<ServiceDetails />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:slug" element={<ProjectDetails />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="faq" element={<FAQ />} />
            <Route path="contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </MotionConfig>
    </BrowserRouter>
  )
}
