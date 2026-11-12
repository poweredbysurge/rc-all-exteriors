# ADR-023: December pages: insurance claims, Arlington, guides 5 to 7

**Date:** 2026-11-11
**Status:** Accepted. Publishes when Mario pushes main.

## Context

The Nov 18 to Dec 17 batch is final in the workspace (`clients/rc-all-exterior/copy-pipeline/website-copy-batch-8-december.md`), with Ricardo's Nov 6 answers applied over it: his Arlington job, a one-day roof replacement timeline, and his OK for an illustrated hail image because he only has wind damage photos. Ricardo's LinkedIn profile was confirmed on Nov 11. RC is publish-first (Surge rule 2c): the pages go live, then Ricardo gets the Now Live doc.

## Decision

1. **Insurance claims is a new service**, `/insurance-claims/`, in `services` right after Storm Damage (icon `file-check`, serviceType Roof Insurance Claim Assistance), copy in `copy/batch-8.md`. **Keyword lanes:** `/storm-damage-roof-repair/` keeps "storm damage roof repair"; this page takes "roof insurance claim" and "roofing insurance claim". Guide 1 covers what policies cover and the 2027 act; this page covers what RC does on a claim and the insurer's deadlines.
2. **The service template takes three things from the guide format.** A copy `[TABLE]` renders in a service section (the insurer deadlines), through a shared `CopyTable` that the guides now use too. A copy `[NOTE]` renders as the guide disclaimer callout, under the FAQ (shared `Note`). A `[REVIEW]` written as a fixed quote renders as written (`quotedReview`, ADR-017), where service pages used to take only hints.
3. **A checklist card on the dark band keeps dark text.** The page's dark band landed on "What we do on your claim", whose checklist sits on the accent tint, and the inverse text rule made it white on a light card. The accent tint now counts as a light surface in the `.on-dark` rules. No other live page had a checklist on its dark band.
4. **Arlington is the third second-wave city**, `copy/batch-8.md`, on the ADR-017 and ADR-021 template, and the first to publish with a real job in its town: Ricardo's November 2025 roof replacement on 10th Road North. The street is named, the house number never is. The review is Megan Hawkins's (Sept 8, 2026), which names no town; the page does not present her as an Arlington customer.
5. **Arlington photos.** Ricardo's photos of the job were still in the group chat at build time, so the proof block shows one general RC roof replacement (`twoStoryWalk`) whose caption and alt text name no town. The proof block now lays out one photo beside the copy and the review, or two above them. Swap `proofPhotos.Arlington` when the photos land. The hero is `newVsOld1` (a townhouse roof beside its neighbor's, the page's shared-wall angle) and, under the ADR-022 rule, the Permits section carries `newDecking`, because Arlington's permit rule turns on the decking. No neighborhoods band: the list is never guessed (ADR-007).
6. **Guides 5 to 7**, `copy/guides-3.md`: roof replacement cost, after the storm, gutter installation cost. Bylines Ricardo Castro, `[PUBLISHED]` the day of the push. The cost page uses the guide template, as the copy asked. Every price in them is a third-party figure labeled as theirs (Remodeling's Cost vs. Value 2025, Angi); none is an RC price. All three open on a text hero, so their `LCP_MAP` entries are `text` (ADR-018).
7. **Illustrations are labeled as illustrations.** A guide may carry an illustration where no real photo exists. It is never passed off as a customer's roof: it lives in `public/images/guides/`, not in the photo registry, its caption says it is an illustration, and its alt text says the same. The first is the hail slot in the storm guide (`hail-damage-illustration.webp`, caption "Illustration, not a photo of a customer's roof."). The slot draws only when the file exists, so a missing file never blocks the build. This is a logged exception to the page templates' real-photos-only rule, approved by Ricardo and Mario for this slot.
8. **Ricardo's LinkedIn** is a plain link at the end of the About paragraph that introduces him, and the `sameAs` of his Person schema. The URL lives in `business.json` under `ownerProfiles`, apart from the business `profiles`, so it never lands in the business `sameAs`.
9. **The insurance claims [IMAGE] slot stays empty.** The registry has no storm-damage photo, and a worn-roof or inspection photo beside the John W Allen story would read as his roof. One of Ricardo's wind damage photos fills it.

## New internal links

- `/insurance-claims/`: services menu, footer, services hub card (batch-4, text from the page's meta description), the storm page's insurance paragraph, guide 1 step 4, the Arlington FAQ, guides 5 and 6.
- `/service-areas/arlington-va/`: hub card (batch-4), footer, city chips, maps, and the Alexandria inspection FAQ ("We also work in nearby Arlington.").
- `/guides/roof-replacement-cost/` from the roof replacement cost FAQ, `/guides/gutter-installation-cost/` from the gutters cost FAQ, `/guides/storm-damage-checklist/` under the storm page's first steps ("Full checklist: after the storm"). The two FAQ links end "shows what moves the number", the guides' own phrase.
- All three guides register on the Resources hub, the mobile menu and the footer from the copy (ADR-019).

## Consequences

- Arlington leaves "Coming soon"; McLean and Great Falls remain.
- When the hail illustration is saved to `public/images/guides/hail-damage-illustration.webp`, the next push shows it. Nothing else changes.
- Brandon Renz's quote in the storm guide is trimmed from his review, and John W Allen's sentence stops before the review's list of what was replaced. Both are noted in the copy files.
- Still open from earlier ADRs: Fairfax, Springfield, Lorton and Alexandria jobs from Ricardo.

## Addendum, 2026-11-12: guide body illustrations

All seven guides now carry two or three body images (16 in all). They are AI illustrations, not photos. Each caption ends "(illustration)", none is presented as an RC job, and each gets replaced with a real job photo as Ricardo sends them.

- The files sit with the job photos in `src/assets/photos/` (`guide-*.webp`) and are registered in `src/data/photos.ts` with job `Illustration`, out of the opening-photo pool and the projects gallery, so they go through the same AVIF and WebP pipeline. They never enter the Article schema images.
- `BODY_IMAGES` in `ArticlePage.astro` places each one by route and H2, after the first block under that H2 (paragraph, table, list or steps). The build fails if a named H2 leaves the copy. No copy text changed.
- They are lazy loaded in a fixed 3:2 frame. No guide's hero or LCP changed.
- The storm guide's hail slot (decision 7) is now `guideStormHail` through its existing copy `[IMAGE]` slot after the wind and hail table. The `public/images/guides/` file path and its draw-only-if-present code are gone.
- The gutter guards guide's cover image is a generic perforated cover. It is not captioned or described as Leaf Relief. The Landmark guide's shingle close-up does not name the brand.

## Addendum, 2026-11-12 (later): three more images, image meta, the 3-image rule

- **Rule** (PAGE-TEMPLATES v1.7, section 4.4): every blog or guide has at least 3 body images, placed under different H2s. Use the client's real job photos first, then labeled Higgsfield illustrations. Every image has alt, title, figcaption, width, height, lazy loading, a descriptive file name and an entry in the Article schema `image`. `npm run check` fails a guide with fewer than 3 body figures, or a body image without alt or a figcaption.
- Three more illustrations: `guideGuttersCorner` (Cost per foot by material), `guideGuardsCleaning` (What gutter guards cost) and `guideInsuranceTree` (What insurance covers, and what it doesn't).
- The roof replacement cost guide had two body images. Its third is a real RC photo, `underlayment` (Roof replacement in progress), under "The national numbers", per the real-photos-first rule. Its hero photo sits outside the article and does not count.
- Body images now carry `title` (the caption without "(illustration)") and width and height from the source file (`Figure` `intrinsic`). The 3:2 frame still sets the drawn size.
- **This supersedes the first addendum's schema line.** The Article `image` is now the hero photo (if any), then every body image, each an `ImageObject` with an absolute URL, width, height and caption. Illustrations are included, and their captions say "(illustration)".
- `og:image` and `twitter:image` on each guide are its hero photo, or else its first body image, cut to 1200 x 630 WebP, with an image alt. Other pages keep the site cards. The business schema keeps the site card.
- File names: the source files are the descriptive names given (`src/assets/photos/guide-*.webp`). Served URLs keep that name plus Astro's content hash (`/_astro/guide-storm-hail.<hash>_<hash>.webp`), which is how the image pipeline busts caches.
