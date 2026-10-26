# ADR-017: Alexandria, the first second-wave city page

**Date:** 2026-10-26
**Status:** Accepted.

## Context

The launch shipped three city pages (Fairfax, Springfield, Lorton) under ADR-007: researched local context, a general RC project in the proof block, and a city review only when the GBP has one. Batch 5 named the month 2 and 3 towns: Alexandria, Fairfax Station, Arlington, McLean, Great Falls. The Alexandria draft (workspace `clients/rc-all-exterior/copy-pipeline/website-copy-batch-6-alexandria.md`) was written to the batch-5 city page rule, which asks for a real Alexandria job and an Alexandria review before publishing. Ricardo has not named either yet.

## Decision

1. **Publish Alexandria now** (Mario, 2026-10-26), as `copy/batch-6.md`, on the same template as the launch cities.
2. **Proof block: a general RC project and a real general Google review**, until an Alexandria job exists. The project is the September 2026 two-story home with dormers (`twoStoryWalk`), and the copy says Alexandria projects will take the spot, as on Fairfax. The review is one sentence from Rick Day's Google review (June 10, 2026), quoted verbatim and checked against the live review on the day of publishing. Rick is not presented as an Alexandria customer.
3. **The angle is the one no ranking page owns:** the historic districts (Parker-Gray staff review, the Board's material and color guidance, the BAR staff number) and the split between City of Alexandria addresses and Fairfax County addresses that carry an Alexandria name. Two sections the launch pages do not have carry it: "Historic districts" after the intro and "What drives the price" after the services band.
4. **Template:** the two sections render only when the copy has them (`maybeSection`), on light surfaces, so Services stays the page's one dark band (ADR-006). A city outside the launch map adds itself to its own map only. `[REVIEW]` now takes either a hint or a fixed quote (`"text" Name, Google review, Month Year`); `quotedReview()` borrows stars, photo and link from the live review when it is in the proxy response.
5. Edits from the draft: "20 minutes down the road" became "just down Route 1" (drive time unconfirmed), "CertainTeed" became "CertainTeed ShingleMaster" (ADR-016), and the meta description gained "roofer" to reach 150 characters.

## Consequences

- Alexandria links from the service areas hub, the footer on every page, the city chips on every page that draws them, the homepage map and chips, and the Fairfax FAQ.
- When Ricardo names an Alexandria job or the GBP gets an Alexandria review, the proof block changes in `copy/batch-6.md` and `proofPhotos`, nothing else.
- Still open from the copy review: confirm the building permit sentence with the Alexandria Permit Center (703-746-4200).
- Next city: Fairfax Station (December), same template, its own batch.

## Addendum, same day: real Old Town proof

Ricardo answered on Oct 26: RC has done several replacements and repairs in Old Town Alexandria, most recently a roof replacement on Duke Street with the roof beams rebuilt and a full TPO flat roof system, and Woodbridge to Kingstowne is about 25 minutes without traffic.

- The proof paragraph is now that job, and the general project and its "Alexandria projects will take this spot" line are gone. The Rick Day review stays.
- The street is named, the house number is not, on purpose: a customer's house number is never published.
- The proof photos are `flatTpo` and `proFlatRoof`, RC flat roof photos that match the kind of job. Their captions and alt text describe the photo and do not say Duke Street, because we do not know they are that house.
- The subhead and the inspection FAQ say "about 25 minutes". The BAR FAQ says RC has worked in Old Town, including the Duke Street flat roof; it does not claim BAR approval for that job.
