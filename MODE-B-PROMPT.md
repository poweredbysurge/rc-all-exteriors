# Claude Code prompt: RC All Exteriors, Mode B production build
Run from the repo root after Gate A is signed. Prerequisites, done by Sam before pasting:

1. `design/GATE-A.md` exists in `workspace/clients/rc-all-exteriors/design/` with the approval date and the four decisions recorded.
2. Repo created: `github.com/poweredbysurge/rc-all-exteriors`, cloned to `~/Surge-Cowork/repos/rc-all-exteriors/`.
3. Copied into the repo root: `design/` (the whole Gate A export), `copy/` (the five batch files and SITEMAP.md from `workspace/clients/rc-all-exteriors/Copy/`), `brand/` (`brand.json`, `logos/*.svg` from Branding), and `templates/website-build/MASTER-WEBSITE-PROMPT.md` as `MASTER-WEBSITE-PROMPT.md`.
4. Photos: the unwatermarked originals from the RC Drive folder dropped into `src/assets/photos/` with their Drive filenames. At minimum the five selects plus one finished-roof shot per job folder.
5. Vercel project created and linked; Resend key for `updates.thesurgeagency.com` and the Command Center tenant token set as env vars (`RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_CC`, `COMMAND_CENTER_URL`, `COMMAND_CENTER_TOKEN`, `GOOGLE_PLACES_KEY`, `GBP_PLACE_ID`, `NEXT_PUBLIC_GA_ID` or the Astro equivalent). Missing ones are fine on day one; the routes degrade per master prompt section 11.

---

## Paste this

Read `MASTER-WEBSITE-PROMPT.md` in full. Sections 1 through 18 are binding. Section 20, MODE B, is what you are doing. Then read, in this order: `design/GATE-A.md`, `design/GATE-A-REVIEW.md`, `design/README.md`, `design/tokens.css`, `design/icons.md`, `design/LINK-MAP.json`, `design/DESIGN-DEBT.md`, `copy/SITEMAP.md`, `brand/brand.json`, then the copy batches as each page needs them.

**INPUT BLOCK**

```
MODE: B, Claude Code production build
BRAND: The Surge Agency
CLIENT: RC All Exteriors LLC. Production domain rcallexteriors.com (currently serving the old WordPress site; cutover at launch). Preview on Vercel.
TRADE: Roofing and exteriors, residential and commercial, Woodbridge VA and Northern Virginia.
STACK: Astro + Tailwind CSS on Vercel. Astro `trailingSlash: 'always'`. Islands only for: lead card, mobile nav panel, FAQ accordion, review carousel if used, map if interactive (default static). Record in adr/ADR-001-stack.md: chosen because the site is 28 content pages with one form; no auth, no live pricing, no app state.
ICP: copy/batch-1.md section 1 persona "Dana", and the brief in design context. Mobile-first; verify at 360 before anything else.
RESEARCH: copy/SITEMAP.md intent lanes and primary keywords per page.
BRAND KIT: design/tokens.css is the token source. brand/brand.json for facts. Fonts: Archivo variable (wdth axis, 700) and Manrope 400/500/600/700, self-hosted as subsetted woff2 in public/fonts with metric-matched fallbacks; no Google Fonts request in production. Icons: lucide (ISC), the names in design/icons.md, 1.75px stroke, never in a circle.
PHOTOS: src/assets/photos/, originals from Drive. Astro <Image> generates WebP/AVIF and srcset. Hero LCP per route preloaded. No JPG or PNG served except favicons and OG images. Captions per design/DESIGN-DEBT.md: job type from the Drive folder name, town CONFIRM never guessed.
BUSINESS FACTS (locked, copy/batch-1.md section 1): RC All Exteriors LLC · (703) 677-1976 · Info@rcallexteriors.com · Mon to Sat 7am to 5pm · Based in Woodbridge, VA · service area Woodbridge, Lake Ridge, Lorton, Fairfax Station, Fairfax, Springfield, Alexandria, Arlington, McLean, Great Falls · Virginia Class A contractor · BBB accredited · 49 five-star Google reviews (live via proxy) · CertainTeed installer · 10-year workmanship warranty · financing available · founded 2025, never led with · owner Ricardo Castro. Service-area business: business.json carries addressLocality Woodbridge and addressRegion VA, no streetAddress, and schema uses areaServed. No street address anywhere in markup.
APPROVED FIGURES: 10-year warranty and 49 reviews. Nothing else. Every [CONFIRM] in the copy renders as a visible placeholder with data-confirm in preview and FAILS the integrity check for production builds, so nothing ships with one.
SITEMAP: copy/SITEMAP.md, 28 launch pages plus /thank-you/, legal, 404. Templates from design/pages/: homepage, service hub (roof-replacement), city (fairfax), offer page (free-roof-inspection), chrome, states.
INTEGRATIONS: /api/lead same-origin route per master prompt section 11: Resend internal notification (must succeed), lead confirmation (only if LEAD_REPLY_FROM is set to a verified RC domain), Command Center forward (best effort). /api/reviews proxy to Google Places with GBP_PLACE_ID, cached 12h, rendered as the rating chip and review wall; falls back to "49 five-star reviews" static. No CRM, no chat, no estimator. GA4 generate_lead on 2xx only, no PII.
LEAD ROUTING: LEAD_NOTIFY_TO = Ricardo's address (CONFIRM), CC manager@thesurgeagency.com. Sender leads@updates.thesurgeagency.com.
LAUNCH: migration. Author deploy/redirects.json now from the old site's URLs (/, /about, /contact, /gutters-siding, /projects, /roof-replacement, /roof-siding-repairs, /windows-doors, plus any blog or category URLs found in the old sitemap) to the nearest new route. Park behind doNotDeployYet. LAUNCH/LIVE host pair in the base layout. Preview host noindex via middleware and host-aware robots.
CLIENT DECISIONS ALREADY MADE: Direction C (ADR-002, values in design/tokens.css). 18px body floor; headings and short copy center on mobile, paragraphs left. One accent. Trailing slashes. Header nav: Services · Service Areas · Warranty · Financing · Reviews · About, phone, CTA (Gate A decision). Lead form per copy/SITEMAP.md reconciliation (step 1 name, phone, email, zip, "What's going on?", SMS consent; step 2 optional street address, roof age, how soon, best time). Keep the connective sentence on the service hub city row, the "We confirm a time" timeline row, and the six section eyebrows (Gate A decisions), all logged as DRAFT copy in copy/DRAFT-ADDITIONS.md for the humanizer pass.
```

**Gate A review fixes to apply in code (design/GATE-A-REVIEW.md findings 1 to 9):** FAQs built from the copy batches, not the export, with FAQPage schema from the same source · mobile trust row shows two items, the rest live in the stat strip · mobile hero scrim 60% from the top, lede below the 40% line, verified at 390 · non-breaking hyphen in "10‑year", nowrap on stat strip values · step numerals at 6% opacity top-left with title padding, or dropped · footer link rows 44px · map as a static tile centered on 22192 with the dot overlay, or the schematic if the tile reads generic · rename tear-off.jpg to underlayment.jpg · hero uses the unwatermarked colonial-home source.

**Build order (master prompt section 20):**
1. Day one setup: Astro scaffold, Tailwind config from design/tokens.css (every token, no arbitrary hex in components), fonts self-hosted with fallback metrics measured on the rendered case, business.json, base layout with LAUNCH/LIVE and the LCP preload map, robots.txt and sitemap.xml as routes reading business.json, middleware noindex on non-production hosts, /api/lead and /api/reviews, STANDARDS.md, DESIGN-DEBT.md (seeded from design/DESIGN-DEBT.md), adr/ADR-001-stack.md, adr/ADR-002-design-direction.md (copied from workspace), scripts/check-integrity, scripts/optimize-images.
2. Chrome: header at 360, 390, 768, 900, 1024, 1440, 1920; mobile nav panel; sticky bottom CTA; footer with roofline rule and data-dni-skip NAP.
3. Lead card, both steps, success, error, loading, retry from localStorage, honeypot, 3-second floor, attribution cookie, GA4 gating. Wire end to end to a test inbox before any page is built.
4. Homepage from design/pages/home-* and copy/batch-1.md section 2.
5. Service hub template from roof-replacement, then all 11 service pages from batches 1 to 4 (roof-replacement, roof-repair, storm-damage-roof-repair, emergency-roof-repair with the phone CTA primary, siding, gutters, windows-doors, certainteed-roofing, metal-roofing, commercial-roofing, skylights).
6. Offer page /free-roof-inspection/ from the design and batch-1 section 6.
7. City template from fairfax, then springfield and lorton (batch-5), swap test between all three before moving on.
8. /services/, /service-areas/ (batch-4), /warranty/, /financing/, /about/, /contact/ (batch-2), /reviews/ (batch-4), /projects/ and the case study template (batch-5).
9. /thank-you/ (noindex), /privacy-policy/ with SMS section, /terms/, /sms-terms/, 404.
10. Redirect map, sitemap, robots, OG images per page type.
11. Verification gate (master prompt section 21) with check-integrity exiting non-zero on any CONFIRM, any JPG or PNG in output, any body text under 18px, any em dash, any kill-list phrase, any unmapped link, any page with fewer than 3 inlinks, any primary keyword collision, any missing LCP preload. Print the inlink table and the keyword audit.
12. Lighthouse mobile on /, /roof-replacement/, /service-areas/fairfax-va/, /free-roof-inspection/: Performance 95+, SEO 100, Accessibility 95+, Best Practices 95+. LCP under 2.5s, INP under 200ms, CLS under 0.1.

**Stop at the verification gate.** Deploy to the Vercel preview host only. Do not touch DNS. Sam reviews the preview, Ricardo answers the CONFIRM list, then the launch protocol runs as a separate session.

Write ADRs the day decisions are made. Log anything the next client would need in STANDARDS.md as a candidate. Baton pass: update `WORKING-ORDER.md` in the repo root at the end of every session with what is done, in flight, blocked, and the commands to resume.
