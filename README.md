# ELEVEN B SITE SENSE

A React + Vite construction website for **ELEVEN B SITE-SENSE NIGERIA LIMITED**, with a white, navy, and gold design. React Router handles all pages, Lucide supplies interface icons, and Framer Motion provides restrained animation with reduced-motion support. The original Vite configuration is preserved.

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
| `/testimonials` | Ready for approved client feedback; no sample quotes |
| `/faq` | Searchable questions, topic filters, and keyboard-friendly accordions |
| `/contact` | Validated enquiry preparation, email/WhatsApp sharing, and official contact details |
| Any unknown page, service, or project | Custom 404 with recovery links |

Service links preselect their service on the contact form. Project enquiry links include the selected demonstration concept in the initial message. Mobile navigation closes on navigation, restores scrolling, supports Escape, and keeps keyboard focus inside the open menu.

## Replace company information

Edit **`src/data/company.js`** for all public company information. The official fields are `companyName`, `brandName`, `rcNumber`, `registrationDate`, and `registrationStatus`; the smaller wordmark line uses `legalSuffix`. The supplied registration is **RC 7650068**, **July 04, 2024**, **ACTIVE**. The registered name appears on About, Contact, the footer, and organization metadata. No tax identifier or unprovided certification is included.

The responsive wordmark uses a gold architectural symbol shared with the favicon. A local 1200 × 630 PNG provides Open Graph and Twitter sharing artwork. After changing the identity, run `npm run assets:brand` to regenerate the artwork and static HTML metadata from the central data. This optional asset-generation command uses an installed Chromium browser; `npm run build` uses the bundled assets and needs no browser. Supply `websiteUrl` before deployment so static sharing image URLs and canonical metadata can use the official domain, then regenerate the assets.

The brand is **ELEVEN B SITE SENSE** and the slogan is **WE BUILD IT BETTER.** The existing mission, description, goal and strengths are retained in the central company data. Ganiyu Taiwo is the contact person. All three phone numbers (08034456275, 08072791980, 08124025129) appear on Contact and in the footer with international `tel:+234...` links. **08034456275 is the sole official WhatsApp contact**, using `2348034456275` in every WhatsApp URL; the other two numbers are alternative telephone contacts. The floating button, homepage CTA, contact page, footer and enquiry preview all use the exact message: "Hello Eleven B Site-Sense Nigeria Limited. I would like to make an enquiry about your construction services." Email links use **ganiyutaiwo2020@gmail.com**. The office is **4th Floor, Lister Building, Ring Road, Ibadan, Oyo State, Nigeria.** These details also appear in organization metadata. Office hours, service coverage and the official domain remain unset until supplied.

Edit the other central data files:

- `src/data/services.js`: all eight services, benefits, process steps, images, and related services.
- `src/data/projects.js`: six demonstration concepts and their galleries. Replace with verified company commissions before presenting a genuine portfolio.
- `src/data/testimonials.js`: empty approved-feedback collection. Add only client quotes with permission to publish; the shared feedback component displays an invitation until then.
- `src/data/faqs.js`: project and service questions.
- `src/data/navigation.js`: navigation entries.
- `src/data/media.js`: curated, illustrative stock image sources.
- `src/data/serviceMedia.js`: eight locally bundled service illustrations and two ceiling detail views. Replace the null photo entries only with approved, visually verified photographs; each service retains its own fallback.

The homepage and About page use the company description, mission and strengths rather than unverified project or team totals. No awards, statistics, client identities, project locations, completion dates, or company achievements are invented. The existing six project concepts retain their routes, filtering and explicit demonstration labels.

## Connect the enquiry form

With `company.contactFormEndpoint` empty, the form validates entries and shows an explicit **unsent enquiry preview**. Visitors can open the complete brief in their email app, review it and send it there, or download a plain-text copy to share. They can also start a WhatsApp conversation using the company's approved message, edit the brief, or start again. Preparing a brief or opening WhatsApp does not claim delivery. Details are held in component memory; there is no local-storage persistence.

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

Services use distinct local illustrations for construction, swimming pools, POP ceilings, styled interiors, tiling, interlocking pavers, stamped paving, and painting. POP includes decorative-ceiling and cove-lighting reference views. Service imagery never falls back to the shared exterior-house illustration. Captions identify these as illustrations and design references. Unverified remote service photos have been removed from the active manifest. Replace the illustrations with approved local photographs when available.

## Verification

Production build and lint pass. Browser verification covers 86 route/layout checks across 320, 375, 710, 768, 1024, 1101, 1440, and 1920 pixels, including all 24 valid and invalid test URLs. Interaction checks cover filtering, FAQ search/reset and keyboard navigation, form validation, service preselection, prepared enquiry sharing and editing, desktop and mobile navigation, direct WhatsApp links, and unavailable-image handling. The report records wordmarks, registered footer identity, and page/social metadata. Checks verify all three telephone links and the sole official WhatsApp number with its exact approved message on every route, plus email, address, official name, RC number, and slogan. They inspect sharing URLs without sending enquiries or contacting the company.

The production preview is checked for exactly one header, navbar shell, and announcement strip on every tested route. Client navigation preserves the same header DOM element. Eight service hero images are checked for distinct subjects and loaded local illustrations, with no generic house fallback; POP's two detail views also load. Quote links preselect the correct service. `service-image-report.json` records the local illustration checks.
