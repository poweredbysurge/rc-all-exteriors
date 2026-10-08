# RC All Exteriors sitemap v1.0 (from the approved copy, 28 launch pages)

Source: `Copy/batch-1.md` through `batch-5.md` (Surge /copy pipeline, v2, updated Sept 30). Every page below has written, humanized copy with meta title, meta description, primary keyword, schema list, H1 through FAQ, and internal links. Red `[CONFIRM]` items in the copy need Ricardo before launch; they do not block design.

Trailing slash: **yes** (the copy's `[URL]` values all carry one). Astro config `trailingSlash: 'always'`. Redirects, canonicals and sitemap agree.

## Intent lanes (one owner per keyword family)

| Lane | Owner | Keywords |
|---|---|---|
| Brand + Woodbridge contractor | `/` | roofing contractor woodbridge va |
| Replacement | `/roof-replacement/` | roof replacement woodbridge va, new roof |
| Repair | `/roof-repair/` | roof repair woodbridge va |
| Leak / emergency | `/emergency-roof-repair/` | roof leak repair, emergency roof repair |
| Storm / insurance | `/storm-damage-roof-repair/` | storm damage roof repair, hail, insurance claim |
| Inspection offer | `/free-roof-inspection/` | free roof inspection (2,500/mo US) |
| Materials | `/certainteed-roofing/`, `/metal-roofing/` | certainteed roofing contractor, metal roofing northern virginia |
| Other trades | `/siding/`, `/gutters/`, `/windows-doors/`, `/skylights/` | trade word + woodbridge or northern virginia |
| Commercial | `/commercial-roofing/` | commercial roofing northern virginia, flat roof |
| Cities | `/service-areas/<city>-va/` | roofing contractor <city> va |
| Trust | `/warranty/`, `/financing/`, `/reviews/`, `/projects/`, `/about/` | brand terms |

## Launch pages

| # | URL | Template | Primary keyword | Copy | H1 |
|---|---|---|---|---|---|
| 1 | `/` | Homepage | roofing contractor woodbridge va | batch-1 §2 | Woodbridge Roofing Contractor With Fair Prices and a 10-Year Warranty |
| 2 | `/roof-replacement/` | Service hub | roof replacement woodbridge va | batch-1 §3 | Roof Replacement in Woodbridge, VA |
| 3 | `/roof-repair/` | Service hub | roof repair woodbridge va | batch-1 §4 | Roof Repair in Woodbridge, VA |
| 4 | `/storm-damage-roof-repair/` | Service hub | storm damage roof repair | batch-1 §5 | Storm Damage Roof Repair in Northern Virginia |
| 5 | `/free-roof-inspection/` | Offer / form page | free roof inspection | batch-1 §6 | Free Roof Inspection in Woodbridge, VA |
| 6 | `/emergency-roof-repair/` | Service hub (urgent variant) | roof leak repair | batch-2 §1 | Roof Leaking? Emergency Roof Repair in Woodbridge, VA |
| 7 | `/warranty/` | Trust page | roofing warranty woodbridge va | batch-2 §2 | A 10-Year Workmanship Warranty on Every Roof |
| 8 | `/financing/` | Trust page | roof financing | batch-2 §3 | Roof Financing for Woodbridge Homeowners |
| 9 | `/about/` | About | brand | batch-2 §4 | About RC All Exteriors |
| 10 | `/contact/` | Contact | brand | batch-2 §5 | Contact RC All Exteriors |
| 11 | `/windows-doors/` | Service hub | window replacement woodbridge va | batch-3 §1 | Window and Door Replacement in Woodbridge, VA |
| 12 | `/gutters/` | Service hub | gutter installation woodbridge va | batch-3 §2 | Gutter Installation and Replacement in Woodbridge, VA |
| 13 | `/siding/` | Service hub | siding replacement northern virginia | batch-3 §3 | Siding Replacement and Repair in Northern Virginia |
| 14 | `/certainteed-roofing/` | Service hub (material) | certainteed roofing contractor | batch-3 §4 | CertainTeed Roofing Contractor in Woodbridge, VA |
| 15 | `/metal-roofing/` | Service hub (material) | metal roofing northern virginia | batch-3 §5 | Metal Roofing in Northern Virginia |
| 16 | `/commercial-roofing/` | Service hub (B2B tone) | commercial roofing northern virginia | batch-4 §1 | Commercial Roofing in Northern Virginia |
| 17 | `/skylights/` | Service hub | skylight replacement | batch-4 §2 | Skylight Replacement and Repair in Woodbridge, VA |
| 18 | `/services/` | Services hub | roofing and exterior services | batch-4 §3 | Roofing and Exterior Services |
| 19 | `/service-areas/` | Service areas hub | northern virginia roofing service areas | batch-4 §4 | Roofing Across Northern Virginia |
| 20 | `/reviews/` | Reviews | rc all exteriors reviews | batch-4 §5 | RC All Exteriors Reviews |
| 21 | `/service-areas/fairfax-va/` | City | roofing contractor fairfax va (350/mo) | batch-5 §1 | Roofing Contractor in Fairfax, VA |
| 22 | `/service-areas/springfield-va/` | City | roofing contractor springfield va (200/mo) | batch-5 §2 | Roofing Contractor in Springfield, VA |
| 23 | `/service-areas/lorton-va/` | City | roofing contractor lorton va | batch-5 §3 | Roofing Contractor in Lorton, VA |
| 24 | `/projects/` | Gallery | brand + projects | batch-5 §4 | Our Work |
| 25 | `/projects/<slug>/` | Case study template | [job type] [town] va | batch-5 §5 | [Job type] in [Town], VA |
| 26 | `/thank-you/` | Confirmation, noindex | | master prompt §11 | |
| 27 | `/privacy-policy/` (with SMS section), `/terms/`, `/sms-terms/` | Legal | | templates/legal | |
| 28 | `/404` | 404 | | | |

**Post-launch (copy roadmap batch 6+):** `/service-areas/alexandria-va/` and `/service-areas/fairfax-station-va/` (month 2), `/service-areas/arlington-va/`, `/service-areas/mclean-va/`, `/service-areas/great-falls-va/` (month 3), then service-by-city pages and `/blog/` guides. The service-areas hub already carries "Coming soon" cards for these; in Mode A draw the cards as non-linked.

## Mode A scope (what gets drawn)

Tokens page · `/` · `/roof-replacement/` (service hub template; the other 10 service pages reuse it) · `/service-areas/fairfax-va/` (city template; Springfield and Lorton reuse it) · `/free-roof-inspection/` (offer page with the full form, since it is the conversion page) · mobile nav open · sticky CTA state · footer · 404 · component sheet.

Everything else is built from these templates in Mode B. `/emergency-roof-repair/` is the service hub template with the phone CTA primary and the form CTA secondary (the copy already flips them).

## Lead form reconciliation (decision needed from Sam)

The copy's `[FORM]` spec: Name · Phone · Street address and zip · What's going on? (Leak / Storm damage / Roof is getting old / Buying or selling a home / Other) · Best time to reach you · button "Book a Free Roof Inspection".

The master prompt standard (section 10): step 1 is Name · Phone · Email · Zip · reason select · SMS consent · honeypot; step 2 is address, asset age, urgency, referral source.

**Proposed merge:** step 1 = Name · Phone · Email · Zip · "What's going on?" using the copy's five labels (keys: `leaking`, `storm_damage`, `old_roof`, `buying_selling`, `something_else`) · SMS consent · honeypot · button "Book a Free Roof Inspection". Step 2 (optional) = Street address · Roof age · How soon · Best time to reach you. Email is added because Command Center and the confirmation email need it; the copy did not forbid it. Confirmation text from the copy: "Got it. Ricardo will call you within [CONFIRM: hours] to set a time."

## Business facts for schema and footer (from batch-1 §1, locked)

- RC All Exteriors LLC · (703) 677-1976 · Info@rcallexteriors.com
- Hours: Monday to Saturday, 7am to 5pm (GBP)
- Service area business: schema and contact page show the service area, **not** the street address (copy decision, batch-2 §5). Woodbridge, VA as `addressLocality`; no `streetAddress`.
- Service area: Woodbridge, Lake Ridge, Lorton, Fairfax Station, Fairfax, Springfield, Alexandria, Arlington, McLean, Great Falls. Virginia only. No MD, no DC.
- Virginia Class A contractor (licence number `[CONFIRM]`)
- BBB accredited
- 49 five-star Google reviews (Sept 2026; live via proxy at launch)
- CertainTeed installer, 3-Star level (program name `[CONFIRM]`)
- 10-year workmanship warranty (terms doc `[CONFIRM]`)
- Financing available (partner and terms `[CONFIRM]`)
- Founded 2025. Copy never leads with years. The old "since 2015" and "9 years" are dropped.
- Owner: Ricardo Castro, on the jobs himself (`[CONFIRM]`)
- Instagram @rcallexteriors; Facebook handle `[CONFIRM]`

## Internal link rules

Each page's copy ends with an "Internal links on this page" line. Those are the required links. Plus: every service hub gets the city chip row (Fairfax, Springfield, Lorton, plus Woodbridge home-base line); every city page links up to `/service-areas/`, sideways to the other two cities, and to `/roof-replacement/`, `/roof-repair/`, `/storm-damage-roof-repair/`. Footer: services, service areas, trust pages, legal. Target: every page reachable from 3 or more pages.

## Still open with Ricardo (does not block design)

Licence number · CertainTeed program name · warranty terms doc · financing partner and link · deposit and payment schedule · emergency hours and response time · inspection lead time · Ricardo's 2 to 3 sentences on his background · photo of Ricardo · Facebook handle · GBP place ID.
