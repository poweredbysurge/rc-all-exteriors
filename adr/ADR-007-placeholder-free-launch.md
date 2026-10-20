# ADR-007: Placeholder-free launch on Ricardo's answers

**Date:** 2026-10-19
**Status:** Accepted

Ricardo answered the launch questions (Google Doc, 2026-10-19). Sam's instruction: process the answers and remove every placeholder from the site. Decisions that changed what the site claims, each confirmed by Sam:

1. **Owner line.** "The owner is on every job" appeared on most pages. It is now "Ricardo quotes every job and signs off on every roof", used once on the homepage lede and once on the About page; the About trust list says "Owner-led". True today and still true with a second crew.
2. **Emergencies.** Office hours stay Monday to Saturday, 7am to 5pm. Emergency calls are "answered after hours and on weekends, and we tell you a real arrival time when you call". No fixed response time is promised, because Ricardo did not give one.
3. **No prices.** No replacement range, no repair minimum, no per-window figure. Every pricing FAQ is qualitative and ends at the written estimate.
4. **Repair warranty.** Published as 60 days on the repaired area, on the repair, emergency, and warranty pages, so the 10-year workmanship claim is never read as covering repairs.
5. **City pages publish without a local job.** The publish gate from the copy is removed. Each city page carries researched housing-stock context (public sources, 2026-10-19), a neighborhood chip list, and the same general RC project in its proof section (the October mansard job, Brava synthetic shake), with copy that says a local project takes the spot when there is one. City reviews render only when the GBP has one.
6. **Legal pages.** Ricardo accepted the standard drafts; the approval slots are cleared. Surge's Command Center, Google Ads, Twilio, and consent revisions come as a later edit.
7. **Brava.** Added to the About credentials, the footer accreditations, and as a paragraph on the roof replacement page. The October mansard photos are captioned as Brava synthetic shake, per Ricardo.
8. **CertainTeed.** "3-Star" is SureStart PLUS 3-Star coverage on Integrity Roof System installs (RoofRunner, SwiftStart, Landmark or Landmark Pro, Shadow Ridge): materials, labor, tear-off, and disposal for 50 years, unlimited wind, one transfer within 15 years. Taken from a registered warranty certificate Sam supplied; no credential tier is claimed beyond that.
9. **Financing.** Enhancify terms from the public page: $500 to $200,000, rates from 7.99% APR, soft pull to see offers, hard inquiry only on acceptance, funding in two to three business days, 0% promotions when available. Eligible: roof replacements, siding, windows and doors.
10. **Facts filled.** Licence 2705196138; 50/50 payments, thirds on large jobs; one to three days; up to five sheets of decking included; walk-through and warranty registration; full property protection; photo report; attic check on active leaks; no pre-purchase inspections; 24-hour repair turnaround; standing seam; Leaf Relief guards, no gutter cleaning; ProVia windows and doors; Velux; CertainTeed MainStreet and Monogram vinyl and HardiePlank; TPO and EPDM only; after-hours commercial work; COI on request; everything from single-family to HOA and commercial.

## What changed in code

- `PhotoGap` renders nothing. `ReviewCard` renders nothing without a live review. `Figure` drops the town when none is known. `TrustPage` skips the hero photo band when there is no photo. The CONFIRM machinery (`data-confirm`, `check-integrity --production`) stays in place and now reports zero.
- City template: neighborhoods and proof photos are data in the page; the gate meta is gone with the copy line.
- `parseCta` accepts external hrefs, and `Cta` opens them in a new tab.
- `business.json` carries the licence, Facebook, the Google review link, Brava, and the two lead addresses (`LEAD_NOTIFY_TO=info@rcallexteriors.com`, `LEAD_NOTIFY_CC=rcroofingllc1@gmail.com` still have to be set on Vercel).

## Still outside the repo

Vercel env vars (lead addresses, Resend, Command Center, `GOOGLE_PLACES_KEY` and `GBP_PLACE_ID`, GA4), the LIVE host switch at cutover, the warranty PDF check of the workmanship-warranty sentences, and the four case studies and photo towns Ricardo said he will send.
