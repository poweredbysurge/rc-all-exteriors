# ADR-021: November pages: Fairfax Station and guides 3 and 4

**Date:** 2026-10-28
**Status:** Accepted. Publishes when Mario merges `november-pages` on 2026-11-02.

Numbered 021 because ADR-020 is the BotID lead form check.

## Context

ADR-017 set the template for second-wave city pages (Alexandria) and ADR-018 and ADR-019 set the guide format and the Resources hub. The November copy is final in the workspace: `clients/rc-all-exterior/copy-pipeline/website-copy-batch-7-fairfax-station.md` (Fairfax Station) and `rc-guides-batch-2-november.md` (guide 3, gutter guards; guide 4, roof repair or replacement). Ricardo answered every open question on Oct 28 and approved both bylines. His Fairfax Station job photos are still coming.

## Decision

1. **Fairfax Station is the second second-wave city**, `copy/batch-7.md`, on the ADR-017 template: a general RC project in the proof block until Ricardo's Fairfax Station photos arrive, and a real Google review from a customer the page does not present as local. The local angle is Fairfax County's permit thresholds, HOA roof rules (Pohick Station as the named example) and shake roofs.
2. **Proof:** photos `twoStoryWalk` (the September 2026 two-story job the copy describes) and `newDecking`, with the registry captions and alt text, which name no town. The review is C John Long's (May 21, 2025, five stars, on the RC All Exteriors LLC profile), checked through Windsor on Oct 28. The review names no town. The quote's second sentence stops at "Cleanup was very well done." where the review continues with ", and if it wasn't for the spectacular new roof...".
3. **Hero photo** `colonialChimney`, not used as a hero on any other city page.
4. **`maybeSection` is generalized.** Any section between Intro and Local proof is a local-angle section, drawn in copy order with its H2 and paragraphs on alternating light surfaces, and the proof band takes the next surface. Services stays the one dark band (ADR-006). Alexandria's Historic districts renders exactly as before; the launch pages have no extra sections and are unchanged. "What drives the price" stays a named optional section after Services.
5. **No neighborhoods band for Fairfax Station.** The copy names no neighborhoods beyond Pohick Station, and the list is never guessed (ADR-007). A city without a researched list skips the band, and the FAQ takes its tint so Why us and the FAQ do not merge.
6. **No photo twice on a city page.** A service card photo that is already in the proof block gives way to `twoStory` (on Fairfax Station, the Storm Damage card).
7. **Guides 3 and 4**, `copy/guides-2.md`, published 2026-11-02, bylines Ricardo Castro. Guides open on a text hero and neither copy has an [IMAGE] slot, so both `LCP_MAP` entries are `text` (ADR-018). The registry has no gutter photo.
8. **[TABLE] with a named first column.** Guide 2's table has an empty corner, so its first column is row headings. Guide 3 (Type, Angi's range) and guide 4 (repair or replace) name the first column, so the template now renders that heading and treats the column as ordinary cells with a stacked label on phones, plus a row divider.
9. **Off-site sources link on first mention and open in a new tab** (ADR-018): Angi's gutter guard article, InterNACHI's life expectancy chart, Fairfax County's permit page, Prince William County's roof replacement sheet, and pwcva.gov in the guide 4 note. The links sit on existing words.
10. **Kill list:** "seamless" is also allowed after a gutter size ("6 inch seamless system", guide 3), alongside "seamless gutters" and "seamless aluminum".

## New internal links

- Fairfax Station: hub card (batch-4, text taken from the page's own subhead), footer, city chips, homepage and city maps (from `liveCities`), sitemap, routes from `cityBatch`.
- Fairfax FAQ "Is Fairfax part of your regular service area?" and Lorton FAQ "Lorton is in Fairfax County. Do you work there?" (batch-5) name and link Fairfax Station. Neither FAQ mentioned it before, so the town name was added: "nearby [Fairfax Station], Lorton, Springfield..." and "..., along with nearby [Fairfax Station]."
- `/gutters/` related link to `/guides/gutter-guards-cost/` is live (the "(when published)" note is gone).
- Guide 4 from `/roof-repair/` ("How do I know if my roof needs repair or replacement?") and `/roof-replacement/` ("Will homeowners insurance pay for a new roof?", the FAQ behind that page's repair-or-replace table; the page has no FAQ that asks the question directly).
- Both guides register on the Resources hub, the mobile menu and the footer from the copy (ADR-019).

## Consequences

- When Ricardo's Fairfax Station photos arrive, the proof paragraph changes in `copy/batch-7.md` and `proofPhotos` in `[city].astro`, nothing else.
- A Fairfax Station neighborhoods list can be added to `neighborhoods` once researched; the band comes back on its own.
- The draft placed each guide's [CTA] near the end; the template draws it after the middle section, as for guides 1 and 2.
