# ADR-016: Business hours match the Google Business Profile

**Date:** 2026-10-26
**Status:** Accepted.

## Context

The site said "Mon to Sat, 7am to 5pm" everywhere: footer, mobile nav, the stat strip, the emergency FAQ, the contact page, the lead emails and the `openingHoursSpecification` in the LocalBusiness schema. RC's Google Business Profile (also mirrored on BrightLocal) says something different:

- Monday to Friday: 7am to 5pm
- Saturday: 8am to 4pm
- Sunday: closed

Two sources disagreeing on hours is a local-ranking and trust problem: Google compares the site's schema and visible NAP+hours against the profile, and a homeowner who calls at 7:30 on a Saturday gets voicemail.

In the same pass, CertainTeed's Find a Pro profile (https://www.certainteed.com/profiles/r-c-all-exteriors-llc) now lists RC All Exteriors LLC as a ShingleMaster. The site said "CertainTeed installer".

## Decision

1. **The Google Business Profile is the source of truth for hours.** The site, the schema and every listing follow it. If the hours change, they change on GBP first, then in `src/data/business.json`, then nowhere else in code.
2. `business.json` `hours` carries everything that renders hours: `display` (chrome, emails), `displayLong`, `statValue` and `statLabel` (the stat strip tile, so no component parses the display string), and `spec` (one entry per distinct opening window; a day with no entry is closed). `schema.ts` maps `spec` straight through.
3. Copy files state the same hours in words. Emergency calls are still answered after hours and on Sundays.
4. `NOWRAP_TERMS` keeps "Mon to Fri", "Mon to Sat", "Sat 8am to 4pm" and any "7am to 5pm" style range on one line, in copy and in the footer and mobile nav.
5. The CertainTeed credential is "CertainTeed ShingleMaster" in `business.json` accreditations, the brand strip claim, the CertainTeed page trust bar and the About trust list. No year count. Text only until the official badge artwork is supplied (DESIGN-DEBT).

## Consequences

- Hours are a data change from now on; the stat strip no longer breaks when the display string changes shape.
- ADR-007's "office hours stay Monday to Saturday, 7am to 5pm" is superseded on hours; its emergency-calls decision stands.
- Any other listing (BBB, Facebook, Yelp, BrightLocal citations) that disagrees with GBP is a listing to fix, not a reason to change the site.

## Addendum, same day: the ShingleMaster badge

Mario supplied CertainTeed's ShingleMaster Credentialed badge (`design/assets/images/IMG_1859.JPG`, 900px on white). It is cut from the white square (edge flood fill, the white banner inside the badge kept) into `src/assets/brands/certainteed-shinglemaster.png` and goes through the image pipeline as WebP.

The image replaces text where a mark reads better than words:

- **Homepage brand strip:** the badge replaces the plain CertainTeed wordmark (the badge carries the CertainTeed name, and the credential is the stronger claim).
- **`/certainteed-roofing/` "Why we install CertainTeed"** and **About "trust signals":** the badge under the H2 (`BADGE_SECTIONS` in `src/data/brands.ts`, `CredentialBadge.astro`), linked to CertainTeed's Find a Pro profile as the proof.

- **Footer** (Mario, same day): the badge replaces the words in the accreditations line, drawn right under it at 72px.

Text stays where the credential is part of a sentence: the CertainTeed page hero trust strip, the About list item, alt text and schema. `business.json` accreditations keeps the string; the footer filters it out of the text line. The share cards still show the CertainTeed wordmark; `certainteed.png` stays for `generate-og.mjs`.
