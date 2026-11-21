# ELEVEN B SITE SENSE

A React + Vite construction website for **ELEVEN B SITE-SENSE NIGERIA LIMITED**, with a white, navy, gold, and turquoise pool-focused design. React Router handles all pages, Lucide supplies interface icons, and Framer Motion provides restrained animation with reduced-motion support. The Vercel `/api/contact` function uses Resend, with server-only Redis coordination. Zoho Mail continues managing the company's mailbox.

Source repository: [skku-global/elevenbsitesense](https://github.com/skku-global/elevenbsitesense.git).

## Run and verify

```sh
npm install
npm run dev
npm run build
npm run lint
npm test
npm run check:client
```

The requested dependencies are already installed. In PowerShell, use `npm.cmd` instead of `npm` if the local execution policy blocks npm's PowerShell wrapper.

Start the dev or preview server, then run `npm run check:browser` to repeat the browser checks. The script uses an installed Chromium browser (Edge, Chrome, or Chromium) and writes screenshots and a JSON report to `artifacts/verification/`. Contact requests are intercepted locally. Set `BROWSER_PATH`, `SITE_URL`, or `BROWSER_DEBUG_PORT` to override local defaults. Only an isolated local browser profile is used. API tests use Node's test runner and a development-only Lua interpreter to execute the production Redis scripts.

## Pages

| Route | Page |
| --- | --- |
| `/` | Homepage |
| `/about` | Company introduction, principles, mission, vision, and approach |
| `/services` | All eight services |
| `/services/:slug` | Service introduction, benefits, process, related services, and enquiry link |
| `/projects` | Nine project videos and a filterable demonstration portfolio; filter is reflected in the URL |
| `/projects/:slug` | Demonstration concept, gallery, relevant services, and related concepts |
| `/testimonials` | Ready for approved client feedback; no sample quotes |
| `/faq` | Searchable questions, topic filters, and keyboard-friendly accordions |
| `/contact` | Validated enquiry submission, retained prepared-brief mode, and official contact details |
| Any unknown page, service, or project | Custom 404 with recovery links |

Service links preselect their service on the contact form. Project enquiry links include the selected demonstration concept in the initial message. Mobile navigation closes on navigation, restores scrolling, supports Escape, and keeps keyboard focus inside the open menu.

## Replace company information

Edit **`src/data/company.js`** for all public company information. The official fields are `companyName`, `brandName`, `rcNumber`, `registrationDate`, and `registrationStatus`; the smaller wordmark line uses `legalSuffix`. The supplied registration is **RC 7650068**, **July 04, 2024**, **ACTIVE**. The registered name appears on About, Contact, the footer, and organization metadata. No tax identifier or unprovided certification is included.

The responsive wordmark uses a gold architectural symbol shared with the favicon. A local 1200 × 630 PNG provides Open Graph and Twitter sharing artwork. After changing the identity, run `npm run assets:brand` to regenerate artwork and static metadata. Use `npm run assets:brand -- --metadata-only` to update metadata while preserving existing artwork. Full artwork generation uses an installed Chromium browser; the build needs no browser. Canonical and sharing URLs use the confirmed domain, **https://elevenbsitesense.com**.

The brand is **ELEVEN B SITE SENSE** and the slogan is **WE BUILD IT BETTER.** The existing mission, description, goal and strengths are retained in central company data. Ganiyu Taiwo is the contact person. All three phone numbers (08034456275, 08072791980, 08124025129) appear on Contact and in the footer with international links. **08034456275 is the sole official WhatsApp contact**, using `2348034456275`; the other two numbers are alternative telephone contacts. Shared links use the standard enquiry message; homepage pool links use their existing contextual messages. Email links use **info@elevenbsitesense.com**, hosted by **Zoho Mail**. The office is **4th Floor, Lister Building, Ring Road, Ibadan, Oyo State, Nigeria.** Office hours and central service-area details remain unset.

Edit the other central data files:

- `src/data/services.js`: all eight services, benefits, process steps, images, and related services.
- `src/data/serviceOptions.js`: shared public service identifiers and titles, without image imports.
- `src/data/enquiry.js`: shared validation and the browser response contract, without credentials.
- `src/data/projects.js`: six demonstration concepts and their galleries. Replace with verified company commissions before presenting a genuine portfolio.
- `src/data/testimonials.js`: empty approved-feedback collection. Add only client quotes with permission to publish; the shared feedback component displays an invitation until then.
- `src/data/faqs.js`: project and service questions.
- `src/data/navigation.js`: navigation entries.
- `src/data/media.js`: curated, illustrative stock image sources.
- `src/data/serviceMedia.js`: local illustrative process/result photography, labelled company projects, galleries, and subject-specific illustration fallbacks.

The pool-focused homepage and TikTok videos coexist with the company introduction and eight-service range. The existing six demonstration concepts retain their routes, filtering, and labels. Approved-feedback data remains empty; the testimonials route is available but hidden from navigation until feedback is supplied.

## Connect the enquiry form

The current endpoint is **`/api/contact`** on Vercel. It sends required enquiries to **info@elevenbsitesense.com** from **Eleven B Site-Sense <info@elevenbsitesense.com>**. Customer acknowledgements are explicitly approved and enabled by **`AUTOREPLY=true`** after required notification acceptance. Optional delivery errors never change a successful enquiry response.

See **[the environment, DNS, and delivery runbook](docs/contact-email.md)** for every manual setting and the public Zoho records inspected. Configure server-only `RESEND_API_KEY`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN`; `.env.example` contains the non-secret approved settings. Production deployment and DNS changes are separate manual actions. Preserve the existing Zoho MX, SPF, and DKIM records.

With `company.contactFormEndpoint` empty, the form validates entries and shows an explicit **unsent enquiry preview**. Visitors can open the complete brief in their email app, review it and send it there, or download a plain-text copy to share. They can also start a WhatsApp conversation using the company's approved message, edit the brief, or start again. Preparing a brief or opening WhatsApp does not claim delivery. Details are held in component memory; there is no local-storage persistence.

The live form submits JSON and a stable UUID idempotency header. The server validates types, lengths, phone numbers, and service identifiers; derives trusted service titles; applies atomic rate limits; and coordinates notification/acknowledgement receipts. The frontend requires matching JSON acceptance. Failed responses and the 15-second client timeout preserve inputs and the retry reference. Provider requests and Redis operations also have bounded timeouts. Use `vercel dev` for local API execution; standalone Vite serves the frontend.

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
  check-client.mjs
api/
  contact.js      Existing Vercel endpoint
server/
  contact-*.js    Server-only coordination, delivery, and email templates
tests/
  *.test.js       Validation and delivery tests with mocked providers
docs/
  contact-email.md  Manual production environment and DNS setup
public/
  favicon.svg     Custom architectural brand mark
```

Typography uses Cormorant Garamond and DM Sans, with local system fallbacks. Images use known Unsplash image URLs, lazy loading below the hero, appropriate alt text, reserved dimensions, and a local architectural illustration if a photo is unavailable. External image and font downloads were blocked by this workspace's network policy, so the browser checks also verified the local fallback behavior. Replace stock imagery with approved company photography when available.

The design includes visible keyboard focus, form labels and errors, a skip link, semantic landmarks, page titles and descriptions, mobile safe-area spacing, and responsive layouts from small phones to wide desktops. Canonical and Open Graph URL metadata use the confirmed company domain.

For production hosting, serve the generated `dist/` folder and configure the host to return `index.html` for client-side routes. Vite's development and preview servers already support these routes.

## Navigation and service-image corrections

`SiteLayout.jsx` exclusively owns the persistent `Navbar` and one separate `AnnouncementBar`. Routed pages render through `Outlet` and never import navigation. Menu state resets on navigation without remounting the header. This eliminates the earlier sibling-key reconciliation problem structurally.

Services use distinct local process/result photographs and galleries for construction, pools, ceilings, interiors, tiling, paving, and painting. Company work and illustrative references retain their labels. Shared image components preserve the subject-specific illustration fallbacks. The homepage's existing hero, layout, and project imagery are preserved.

## Verification

Run tests, lint, build, and `check:client` to verify the contact implementation and production bundle. Browser verification covers 86 route checks across 320, 375, 710, 768, 1024, 1101, 1440, and 1920 pixels, including 24 valid/invalid URLs. It checks filtering, FAQs, contacts, form validation, mocked submission errors and acceptance, stable retry references, new/changed enquiry references, navigation, and image fallbacks. Existing homepage mobile overflow is recorded as a separate layout warning. Contact requests are intercepted; no real enquiries are sent.

The production preview is checked for one header, navbar shell, and announcement strip per route. Client navigation preserves the header DOM element. Eight service hero photographs are checked for distinct subjects and successful loading; POP's detail views also load. Quote links preselect their service. `service-image-report.json` records these checks. Real Resend/Zoho delivery remains a manual verification step after configuration.
