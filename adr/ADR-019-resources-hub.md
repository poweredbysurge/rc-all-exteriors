# ADR-019: Resources is the nav hub; guides and the blog keep flat URLs

**Date:** 2026-10-26
**Status:** Accepted. Supersedes the `/guides/` index from ADR-018 (the guide pages, template and schema stand).

## Context

ADR-018 shipped two guides under a `/guides/` index, linked from the footer and the Services menu. Mario wants one place for everything a homeowner reads before they call: the guides, the warranty, financing and the free inspection, and a blog later. The top bar had six items (Services, Service Areas, Warranty, Financing, Reviews, About).

## Decision

1. **Top nav:** Services · Service Areas · Resources · Reviews · About. Warranty and Financing leave the top bar; they stay in the footer's Company column and in the hub's "Helpful pages". Resources is a plain link (no dropdown) on desktop, and a group in the mobile menu (the hub, then each guide by its short title) and under Company in the footer.
2. **`/resources/` is the one hub** (`src/pages/resources.astro`, copy in `copy/guides-1.md` section 1): a two-sentence intro, Guides (a card per guide: title, `[SUMMARY]`, date), Helpful pages (warranty, financing, free inspection, from the copy), a Blog section only when there is a post, and a CTA band. CollectionPage, ItemList and BreadcrumbList schema.
3. **Content URLs stay flat:** `/guides/<slug>/` and `/blog/<slug>/`. Short, keyword-led URLs, and the two guide slugs were already linked from live pages. `/guides/` itself answers 301 to `/resources/` (an on-demand route, like the legacy redirects) and is not in the sitemap.
4. **Breadcrumbs:** Home > Resources > guide. BreadcrumbList carries the full guide title; the visible trail shows the guide's `[SHORT TITLE]`, because the full title is the H1 directly below it.
5. **Articles register themselves.** `src/data/nav.ts` reads every copy page under `/guides/` or `/blog/` with a `[PUBLISHED]` date. A new guide or post is a copy file; the hub card, footer and mobile links, routes, breadcrumbs and sitemap follow.
6. **The blog is built and dormant.** `src/pages/blog/[slug].astro` uses the same `ArticlePage` layout as the guides (byline, dates, TOC, mid-article CTA, FAQ, Article schema, lead card with `form_id: post`). `src/pages/blog/[...index].astro` builds `/blog/` only when `hasBlog` is true, and the same flag gates the menu and footer link, the hub section and the sitemap entry. With zero posts `/blog/` is a 404 and nothing links to it. The index copy is ready in `copy/blog-index.md`. No sample posts.
7. **Links back:** `/warranty/` and `/financing/` carry a "More resources" link in the copy; the guides' related chips end with "All resources".

## Consequences

- The first blog post: add `copy/blog-1.md` with a `/blog/<slug>/` page block. Nothing else to switch.
- Guide and post chips use the short title (`chipLabel`), so a long title never overflows a chip at 414px.
- The "Roofing guides" link under Services (ADR-018) is gone; Resources replaces it.
