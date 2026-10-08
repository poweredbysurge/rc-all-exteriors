# RC All Exteriors · Mode A design package

Date: 2026-10-08 · Direction C "Crew" (ADR-002) · iteration 01 system applied to every page · Gate A export for Sam's review. Mode B (code) starts from this folder and nothing else.

## What is in here

- `pages/<artboard>/index.html`: one self-contained HTML file per artboard. Open any of them in a browser; no build step. Each links `../../tokens.css` and `../../assets/`. Annotations sit to the left of every section and repeat as an HTML comment directly above it (`<!-- section: ... | bg: ... | padding: ... | template: ... -->`).
- `tokens.css`: every token as a CSS custom property, with a contrast comment on every text-on-surface pair and the four resolved ADR-002 values at the top.
- `icons.md`: the Lucide icon list and what each one is used for.
- `LINK-MAP.json`: every link on every artboard as `{ artboard, label, href }`. Every `href` on every page appears here. There are no `#` hrefs: in-page actions are `<button data-action="...">` (see below).
- `GATE-A-CHECKLIST.md`: the pre-export check, pass or fail per item.
- `DESIGN-DEBT.md`: every unresolved item with the artboard it lives on.
- `assets/images/`: the five photos used, named as on the artboards. `assets/logos/`: the three SVGs. `assets/fonts/`: empty; Archivo and Manrope load from Google Fonts here and are self-hosted in code.

## Canonical artboards (27)

- `tokens`
- `components`
- `home-390`
- `home-1440`
- `lead-card-step1`
- `lead-card-step2`
- `lead-card-success`
- `lead-card-error`
- `lead-card-loading`
- `roof-replacement-390`
- `roof-replacement-1440`
- `fairfax-390`
- `fairfax-1440`
- `free-roof-inspection-390`
- `free-roof-inspection-1440`
- `header-360`
- `header-390`
- `header-1440`
- `header-1920`
- `nav-open-390`
- `sticky-cta-390`
- `footer-390`
- `footer-1440`
- `404-390`
- `404-1440`
- `thank-you-390`
- `thank-you-1440`

The three direction boards and every pre-finalize artboard are not in this package.

## Finding things in the HTML

- `data-confirm="..."`: every [CONFIRM] slot (text, photo gap, review block, map). One search finds them all.
- `data-action="..."`: in-page actions that are not links. Values and what they do:
  - `lead-card`: in-page: scrolls to the hero lead card (mobile primary CTA)
  - `submit`: form action: POST to the lead endpoint, then step 2 in place
  - `finish`: form action: submits step 2 (optional fields), then success in place
  - `skip`: form action: skips step 2, shows success in place
  - `menu`: opens the mobile nav panel
  - `close`: closes the mobile nav panel
  - `services`: toggles the Services group in the mobile nav
  - `accordion`: expands the 12-item services list in the mobile footer
- `data-screen-label`: the artboard or section name.
- `data-dni-skip`: the footer NAP block that call tracking must not rewrite.

## Rules the pages follow

- Headings Archivo Expanded 700, sentence case. Body Manrope 400 / 500 / 600 / 700. Nothing below 16px.
- One accent, #0F2ACE. Icons are accent on light and white 90% on dark.
- Every photo carries a caption with the job type and a "town CONFIRM" tag. Missing photos are labeled placeholder blocks.
- Review text is never typed in; every review slot is a striped placeholder for verbatim Google text.
- No street address. "Based in Woodbridge, VA" and the service area only.
