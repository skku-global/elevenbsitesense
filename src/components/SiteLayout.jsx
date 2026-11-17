import { Outlet, useLocation } from 'react-router-dom'
import { Suspense } from 'react'
import AnnouncementBar from './AnnouncementBar'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppButton from './WhatsAppButton'
import ScrollToTop from './ScrollToTop'
import PageLoading from './PageLoading'

// All routes share this one layout. Pages render only through Outlet.
// The header remains mounted across navigation; it is never keyed by the route.
export default function SiteLayout() {
  const { pathname } = useLocation()
  return (
    <>
      <ScrollToTop />
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <AnnouncementBar />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppButton key={`whatsapp-${pathname}`} />
    </>
  )
}
