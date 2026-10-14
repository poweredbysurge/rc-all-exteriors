# ADR-001: Stack

**Date:** 2026-10-07
**Status:** Accepted
**Decided by:** Sam Delgado (Mode B input block), recorded at build start

## Decision

Astro 7 + Tailwind CSS 4 on Vercel, `trailingSlash: 'always'`, static output with the Vercel adapter.

Chosen because the site is 28 content pages with one form. There is no auth, no live pricing and no app state, so none of the Next.js escalation triggers in master prompt section 2 apply.

## How it is built

| Concern | Choice |
|---|---|
| Pages | Prerendered static HTML. 27 indexable pages plus `/thank-you/` and 404. |
| On-demand routes | `/api/lead/`, `/api/reviews/`, `/robots.txt` (host-aware). Everything else is static. |
| Preview lock | Edge middleware (`middlewareMode: 'edge'`) adds `X-Robots-Tag: noindex` on any host that is not the production domain. robots.txt is the first lock. |
| Interactivity | No UI framework. The lead card, mobile nav, FAQ accordion, dropdown, sticky CTA and reveal are plain TypeScript in two bundled scripts (`src/scripts/site.ts`, `src/scripts/lead.ts`). This is the "islands only" rule taken to its floor: the homepage ships about 6KB of JS gzipped. |
| Tokens | `design/tokens.css` is the source. `scripts/sync-tokens.mjs` generates the Tailwind 4 `@theme` block from it, so the read-only design folder is never retyped. Tailwind 4 has no `tailwind.config`; the generated `src/styles/theme.generated.css` is the config. |
| Copy | `src/lib/copy.ts` parses `copy/batch-*.md` at build. Pages render the parsed blocks; nothing is retyped. FAQPage schema comes from the same blocks. |
| Fonts | Self-hosted in `public/fonts`: Archivo Expanded 700 (14KB) and Manrope variable (25KB), Latin subset. Fallback faces are measured in headless Chrome over the site's own headings and paragraphs (`scripts/measure-fallbacks.mjs`). |
| Images | Originals in `src/assets/photos`, AVIF and WebP with srcset from Astro's sharp service. Originals are pruned from the output after the build. |
| Icons | `lucide` rendered to inline SVG at build. No icon JS ships. |

## Notes

- Google Fonts serves Archivo at `wdth 125, wght 700` as a static instance, not a variable file. That is the only instance the site renders, so the instance is what is hosted. If a second width is ever needed, re-download with a `wdth` range.
- CSS is inlined (`inlineStylesheets: 'always'`). One fewer render-blocking request matters more than cross-page CSS caching on a site where most visits are one or two pages.
- `/api/lead/` carries the trailing slash like every other route. The form posts to that exact path.

## Rejected

- **Next.js.** No trigger applies; it would ship a framework runtime to a brochure site.
- **A UI framework for islands (React, Preact, Svelte).** The interactive surface is one form and some toggles.
- **Astro's built-in fonts API.** Its automatic fallback metrics use the default instance, which is wrong for an expanded face.
