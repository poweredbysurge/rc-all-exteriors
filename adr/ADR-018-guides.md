# ADR-018: A /guides/ section, authored by Ricardo

**Date:** 2026-10-26
**Status:** Accepted. The `/guides/` index, the footer "Guides" link and the Services menu link are superseded by the Resources hub (ADR-019); the guide pages, template and schema stand.

## Context

The site plan calls for two guides a month. Two slugs were already linked from live pages as "(when published)": `/guides/does-insurance-cover-roof-replacement/` from the storm damage page and `/guides/certainteed-landmark-shingles/` from the CertainTeed page. The approved copy (workspace `clients/rc-all-exterior/copy-pipeline/rc-guides-batch-1-november.md`) carries bylines for Ricardo Castro, and its fact ledgers, E-E-A-T tables and scores are internal. The master prompt (section 9) specifies a blog index and post with a desktop table of contents, author, date, related posts, a mid-post CTA and `Article` schema.

## Decision

1. **The section is `/guides/`, not `/blog/`**, because the slugs were already live in links and the content is reference material, not news.
2. **Copy stays the source of truth.** `copy/guides-1.md` uses the batch format and `src/lib/copy.ts` reads `copy/guides-*.md` beside the batches, with four new tags: `[BYLINE]`, `[TABLE]` (rows start with `|`, first row is the header), `[NOTE]` (a visible callout) and `[CTA]` (the mid-article action). Spec keys `[PUBLISHED]` and `[MODIFIED]` date each guide. Only the guide pages and a short index are in the repo; the ledgers and audits stay in the workspace.
3. **Template** (`src/pages/guides/[slug].astro`): the text `PageHero` with the byline in a new `meta` slot (Ricardo Castro links to /about/), a 720px reading column, a sticky table of contents from `lg`, the copy's `[CTA]` drawn on a dark panel after the middle section, the `[NOTE]` as a callout, the FAQ accordion, related links from the copy's internal links, and a lead card (`form_id: guide`). The H1 is the LCP.
4. **Schema:** `Article` with the owner as author by `@id` (`/about/#person`, now set on the About page's Person), the business as publisher, `datePublished` from `[PUBLISHED]` and `dateModified` from `[MODIFIED]`, which is added only when the content changes (until then it equals the published date); `FAQPage` from the same blocks as the accordion; `BreadcrumbList` Home > Guides > guide.
5. **Accuracy edits from Ricardo's Oct 26 answers:** guide 2 says RC registers SureStart PLUS 3-Star when the customer chooses the extended warranty and the full CertainTeed system goes on, and the 130 mph line says CertainTeed starter and hip and ridge go on with that option, not every job. The guide 2 image is a finished RC shingle roof captioned as the registry captions it; it is not claimed to be Landmark Pro.
6. **Links:** statute and regulation numbers link to law.lis.virginia.gov on first mention, and off-site links open in a new tab. The two "(when published)" links are live, guide 1 is linked from the emergency repair FAQ and guide 2 from the roof replacement cost FAQ. "Guides" is in the footer and as "Roofing guides" under the Services menu; the main nav is unchanged.
7. The kill list allows "premier" only as CertainTeed's "ShingleMaster PREMIER" tier name.

## Consequences

- A new guide is a block in a `copy/guides-*.md` file, an entry in `guides` (`src/data/nav.ts`) and an `LCP_MAP` line.
- The guides show "Published November 2026" and `datePublished` 2026-11-01 as the copy asked, while the pages went live on 2026-10-26.
- Category filter chips on the index wait until there are enough guides to filter.
