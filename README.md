# ELEVEN B SITE SENSE

A React + Vite construction website for **ELEVEN B SITE SENSE NIGERIA LIMITED**, with a white, navy, and gold design. React Router handles all pages, Lucide supplies interface icons, and Framer Motion provides restrained animation with reduced-motion support. The original Vite configuration is preserved.

Source repository: [skku-global/elevenbsitesense](https://github.com/skku-global/elevenbsitesense.git).

## Run and verify

```sh
npm install
npm run dev
npm run build
npm run lint
```

The requested dependencies are already installed. In PowerShell, use `npm.cmd` instead of `npm` if the local execution policy blocks npm's PowerShell wrapper.

Start the dev server, then run `npm run check:browser` to repeat the browser checks. The script uses an installed Chromium browser (Edge, Chrome, or Chromium), adds no testing dependencies, and writes screenshots and a JSON report to `artifacts/verification/`. Set `BROWSER_PATH` or `SITE_URL` to use a different executable or server address. Only an isolated local browser profile is used.

## Pages

| Route | Page |
| --- | --- |
| `/` | Homepage |
| `/about` | Company introduction, principles, mission, vision, and approach |
| `/services` | All eight services |
| `/services/:slug` | Service introduction, benefits, process, related services, and enquiry link |
| `/projects` | Filterable demonstration portfolio; filter is reflected in the URL |
| `/projects/:slug` | Demonstration concept, gallery, relevant services, and related concepts |
| `/testimonials` | Clearly labelled sample feedback |
| `/faq` | Searchable questions, topic filters, and keyboard-friendly accordions |
| `/contact` | Validated enquiry form and configurable contact options |
| Any unknown page, service, or project | Custom 404 with recovery links |

Service links preselect their service on the contact form. Project enquiry links include the selected demonstration concept in the initial message. Mobile navigation closes on navigation, restores scrolling, supports Escape, and keeps keyboard focus inside the open menu.

## Replace company information

Edit **`src/data/company.js`** for all public company information. The official fields are `companyName`, `brandName`, `rcNumber`, `registrationDate`, and `registrationStatus`; the smaller wordmark line uses `legalSuffix`. The supplied registration is **RC 7650068**, **July 04, 2024**, **ACTIVE**. The registered name appears on About, Contact, the footer, and organization metadata. No tax identifier or unprovided certification is included.

The responsive wordmark uses a gold architectural symbol shared with the favicon. A local 1200 × 630 PNG provides Open Graph and Twitter sharing artwork. After changing the identity, run `npm run assets:brand` to regenerate the artwork and static HTML metadata from the central data. This optional asset-generation command uses an installed Chromium browser; `npm run build` uses the bundled assets and needs no browser. Supply `websiteUrl` before deployment so static sharing image URLs and canonical metadata can use the official domain, then regenerate the assets.

Contact details are intentionally empty. The UI labels these as awaiting company information and avoids links to invented recipients. WhatsApp uses an international phone number with 7–15 digits; until one is supplied, the floating button opens an explanation and a working enquiry link.

Edit the other central data files:

- `src/data/services.js`: all eight services, benefits, process steps, images, and related services.
- `src/data/projects.js`: six demonstration concepts and their galleries. Replace with verified company commissions before presenting a genuine portfolio.
- `src/data/testimonials.js`: demonstration text without real customer identities or ratings. Replace with approved client quotes and permission to publish.
- `src/data/faqs.js`: project and service questions.
- `src/data/navigation.js`: navigation entries.
- `src/data/media.js`: curated, illustrative stock image sources.
- `src/data/serviceMedia.js`: service-specific stock-photo references, cropping, and distinct offline previews. Interlock and stamped-paving photographs remain unset until a verified source is supplied; their previews show the actual paving patterns instead of a house.

The homepage and About page retain clearly labelled placeholders for unprovided experience, project totals, and team information. Registration facts are displayed separately. No awards, client identities, project locations, completion dates, or company achievements are invented.

## Connect the enquiry form

With `company.contactFormEndpoint` empty, the form validates entries and shows an explicit **unsent enquiry preview**. Visitors can download a plain-text copy, edit it, or start again. Details are held in component memory; there is no local-storage persistence or pretend delivery.

To enable submission, set `contactFormEndpoint` to the company's verified HTTPS submission endpoint. It must accept JSON with `name`, `email`, `phone`, `service`, `serviceTitle`, `message`, and `source`, allow the deployed site's origin through CORS, and return a successful 2xx HTTP status only when it accepts the enquiry. Non-2xx responses, network failures, and a 15-second timeout show an error and preserve the entered details. No backend, inbox, or third-party account has been fabricated or provisioned.

## Structure and design

```text
src/
  assets/images/   Local architectural fallback artwork
  components/     Shared navigation, cards, buttons, imagery, form, SEO, and interactions
  data/           Company, navigation, services, projects, feedback, FAQ, and image data
  pages/          All ten page components, including dynamic details and 404
  styles/         Design variables, reusable components, and responsive page layouts
scripts/
  browser-check.mjs
public/
  favicon.svg     Custom architectural brand mark
```

Typography uses Cormorant Garamond and DM Sans, with local system fallbacks. Images use known Unsplash image URLs, lazy loading below the hero, appropriate alt text, reserved dimensions, and a local architectural illustration if a photo is unavailable. External image and font downloads were blocked by this workspace's network policy, so the browser checks also verified the local fallback behavior. Replace stock imagery with approved company photography when available.

The design includes visible keyboard focus, form labels and errors, a skip link, semantic landmarks, page titles and descriptions, mobile safe-area spacing, and responsive layouts from small phones to wide desktops. Canonical and Open Graph URL metadata use the configured domain only after `websiteUrl` is supplied.

For production hosting, serve the generated `dist/` folder and configure the host to return `index.html` for client-side routes. Vite's development and preview servers already support these routes.

## Navigation and service-image corrections

`SiteLayout.jsx` exclusively owns the persistent `Navbar` and one separate `AnnouncementBar`. Routed pages render through `Outlet` and never import navigation. Menu state resets on navigation without remounting the header. This eliminates the earlier sibling-key reconciliation problem structurally.

Services now have their own media manifest and distinct offline previews for construction, swimming pools, POP ceilings, styled interiors, tiling, interlocking pavers, stamped paving, and painting. POP includes additional decorative-ceiling and cove-lighting reference views. Service imagery never falls back to the shared exterior-house illustration. Preview captions explicitly state that photographs are unavailable. The stock references use Unsplash and Pexels; external download restrictions prevent verifying or bundling these photographs in this environment. Replace them with approved local photographs when available.

## Verification

Production build and lint pass. Browser verification covers 86 route/layout checks across 320, 375, 710, 768, 1024, 1101, 1440, and 1920 pixels, including all 24 valid and invalid test URLs. Interaction checks cover filtering, FAQ search/reset and keyboard navigation, form validation and honest success feedback, service preselection, enquiry editing, desktop and mobile navigation, WhatsApp fallback, and unavailable-image handling. The report records wordmarks, registered footer identity, and page/social metadata, with registration panel screenshots on desktop and mobile.

The production preview was also checked for exactly one header, navbar shell, and announcement strip on every tested route. Client navigation preserves the same header DOM element. Eight service hero images were checked for distinct subjects and loaded local previews, with no generic house fallback; POP's two detail views also loaded. Quote links preselect the correct service. `service-image-report.json` explicitly records that photographic accuracy could not be verified because external requests are blocked.
