# RC All Exteriors site: standing constraints

Read `README.md`, then `MASTER-WEBSITE-PROMPT.md` in full, then `GATE-A.md`, `design/GATE-A-REVIEW.md`, `design/DESIGN-DEBT.md`, `copy/SITEMAP.md` before writing code.

1. **`design/` is read-only after Gate A.** Build from it; never edit it. Deviations go in `DESIGN-DEBT.md` at the repo root with the artboard named.
2. **Copy comes from `copy/batch-*.md`, never from the design export.** The export is missing collapsed FAQ answers. FAQPage schema is generated from the same copy source as the visible accordion, so they cannot drift.
3. **Every `[CONFIRM]` in the copy is a placeholder.** Render it with `data-confirm` in preview. `scripts/check-integrity` fails a production build on any remaining one. Never resolve one by guessing.
4. **No street address in markup or schema.** `business.json` has `addressLocality` Woodbridge and `addressRegion` VA only. Schema uses `areaServed`.
5. **Tokens come from `design/tokens.css`, then `brand/tokens.overrides.css`** (post-Gate-A changes, each with an ADR). `scripts/sync-tokens.mjs` reads both; never edit `theme.generated.css` by hand. No arbitrary hex in components. Section padding `--section-py-mobile: 100px`, `--section-py-desktop: 128px`.
6. **Fonts self-hosted.** Archivo variable (wdth axis, 700) and Manrope 400/500/600/700 as subsetted woff2 in `public/fonts`, metric-matched fallbacks measured on the rendered case. No Google Fonts request in production.
7. **Images through the pipeline.** Originals in `src/assets/photos/`, Astro `<Image>` emits WebP/AVIF with srcset. Any JPG or PNG in the output except favicons and OG images fails the gate.
8. **Lead form contract** per master prompt section 11 and `copy/SITEMAP.md` reconciliation. Field names are a contract with Command Center; do not rename.
9. **Trailing slashes always.** Redirects, canonicals, sitemap agree. `deploy/redirects.json` is authored during the build and parked until cutover.
10. **No em dashes anywhere**, including comments and alt text.
11. **Baton pass.** Update `WORKING-ORDER.md` at the end of every session: done, in flight, blocked, commands to resume.
12. **ADRs the day decisions are made**, in `adr/`.
