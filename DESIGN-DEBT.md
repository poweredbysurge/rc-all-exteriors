# DESIGN-DEBT.md: what the port changed, and what should be fixed upstream

Seeded from `design/DESIGN-DEBT.md` (Gate A export, 2026-10-07). `design/` is read-only; every deliberate deviation in code is listed here with the artboard it departs from.

## Gate A review fixes applied in code (design/GATE-A-REVIEW.md)

| # | Finding | What the build does | Artboards |
|---|---|---|---|
| 1 | Collapsed FAQ answers missing from the export | FAQs render from `copy/batch-*.md`. Every answer is in the HTML. FAQPage schema is generated from the same blocks. | all with FAQ |
| 2 | Mobile hero about 2,000px tall | Trust row shows the rating chip plus one item below 1024px. The rest are in the stat strip. | home-390, roof-replacement-390, fairfax-390 |
| 3 | Lede contrast at the top of the mobile scrim | Scrim is 60% from 0 to the 40% line, then fades to the solid dark surface. Verified at 390 on `/free-roof-inspection/` and `/roof-replacement/`. | *-390 heroes |
| 4 | "10-year" and "Class A" break across lines | Wrapped in `white-space: nowrap` wherever copy is rendered (`NOWRAP_TERMS`), and on stat values. **Not** the U+2011 hyphen: neither font file has that glyph, so it would render in the fallback face. | home, roof-replacement, stat strips |
| 5 | Step numerals smudge under wrapped titles | Numeral at 6% opacity, top-left, above the title instead of behind it. | home, roof-replacement |
| 6 | Footer link rows about 34px | Every footer link row is 44px. | footer-390, footer-1440 |
| 7 | Schematic map | Kept schematic, by decision. See ADR-004. | home, fairfax |
| 8 | tear-off.jpg is an underlayment shot | Source renamed `rc-select-03-underlayment.jpg`; registry key `underlayment`. | home, roof-replacement |
| 9 | Hero photo has the RC mark baked in | **Not fixed.** The unwatermarked `colonial-home-roof-replacement-gray-shingle-01.jpg` is not in the repo. See Blocked. | home |
| 10 | Section padding 100px / 128px | From `design/tokens.css` through the generated theme (`section-y`, `section-y-quiet`). | all |

## Deviations from the artboards

- **Mobile hero photo is a 3:4 crop behind the headline, not a cover image behind the whole hero.** ADR-004. Fix upstream by drawing the mobile hero that way. Artboards: every *-390 hero.
- **Hero switches to two columns at 1024px, not 900px.** At 900 the copy column would be 348px, too narrow for the H1. Between 900 and 1023 the hero is stacked under the desktop nav.
- **Header between 900 and 1279.** Not drawn. The phone number collapses to an icon button and the CTA reads "Free Roof Inspection" (1024 to 1279) or "Free Inspection" (900 to 1023) so the six nav items fit. Full label and number from 1280. Artboards: header-1440 is the only desktop state drawn.
- **Header shrinks on scroll** to 56px (mobile) and 64px (desktop). The outer element keeps its height so nothing shifts.
- **Services dropdown** on desktop. Not drawn. Two columns, all 12 services plus "All services". Opens on hover, focus and click; closes on Escape and outside click.
- **Footer services accordion, expanded.** Not drawn. 44px rows. Without JS the list is open.
- **Tertiary link arrows are the Lucide `arrow-right` icon**, not the "→" character: the Latin font subsets have no arrow glyph.
- **Hamburger, close and phone glyphs are Lucide icons** (`menu`, `x`, `phone`), not the text characters in the export.
- **Stat strip on the homepage is 2 by 2 at every width.** Drawn as four across in a 7-column cell, where "Mon to Sat" cannot fit on one line at 30px. The full-width boxed variant on city pages is four across as drawn.
- **Stat strip on phones** stacks the icon above the value, at 22px, so "Mon to Sat" stays on one line.
- **Rating chip replaces "49 five-star Google reviews" in the trust row** on every page, as drawn on the homepage. The count in it is live.
- **Process steps on service pages without job photos** (gutters, siding, windows, storm, metal and the rest) render without the photo row. Roof replacement and the homepage have photos as drawn.
- **CTA band position on service pages** follows roof-replacement-1440: after the process section when there is one, otherwise above the FAQ.
- **"More links" chip row** under Related services carries any required internal link (the copy's "Internal links on this page") that is not already in the body.
- **Roof replacement "Repair or replace" table and material cards** are their own quiet bands under the section they belong to.
- **Lead card step 2 radios** are native radio inputs styled as chips, not `button role="radio"`, for keyboard behavior.
- **Lead card fields are empty**, with no sample values. The artboards show "Dana Whitfield" as filled state.
- **City page "Read the full project" link** is a CONFIRM slot, not a link to `/projects/fairfax-job/`, which does not exist. It becomes a link when a case study is added to `src/data/projects.ts`.
- **City page photo captions** do not say "(placeholder for a Fairfax job)". The two photos sit inside a `data-confirm` wrapper instead, so the page cannot publish with stand-in photos.
- **Neighborhood chips** on city pages are one CONFIRM slot, not six blank chips.

## Pages with no artboard (built from the templates and primitives)

Trust and hub pages use a text hero on the dark surface (no photo, so the H1 is the LCP element): `/services/`, `/service-areas/`, `/warranty/`, `/financing/`, `/about/`, `/contact/`, `/reviews/`, `/projects/`, legal. Their sections are laid out by `ContentSection.astro` from what each section of copy contains. Draw these upstream if they need more than the system gives them.

- `/emergency-roof-repair/` is the service hub with the phone CTA primary in the hero and in the CTA band.
- `/contact/` puts the form in a bordered card beside the contact details.
- `/projects/` is a filterable grid of the five real photos. Case studies come from data; there are none yet.

## Photo gaps (labeled blocks, each a CONFIRM slot)

Carried from the design export, plus the ones the other pages call for:

- Ricardo walking a homeowner through a written estimate (home, process step 2)
- Written estimate on the kitchen table (roof-replacement, process step 2)
- Metal roof (roof-replacement material card)
- Before and after of a Northern Virginia home (roof-replacement)
- Ricardo on a roof during an inspection; sample page from an inspection photo report (free-roof-inspection)
- Ricardo Castro on a job site (about; the yard-sign photo stands in above the slot)
- Close-up before and after of a flashing or shingle repair (roof-repair)
- Hail marks on shingles from a local job (storm-damage)
- Window or front door before and after (windows-doors)
- A finished CertainTeed roof with the shingle color labeled (certainteed)
- A real job with before and after for each of Fairfax, Springfield, Lorton
- No siding, gutter, window, door, crew or truck photos exist yet. Those service pages reuse roofing photos in the hero.

## Blocked on inputs

- **Photo originals.** Only the five 1440 to 2400px selects are in `src/assets/photos/`. The 30 originals are in the RC Drive folder (`PHOTO-INVENTORY.md`). Until they are dropped in: the homepage hero is the GBP cover with the RC mark baked in at bottom right, the mobile hero crop is cut from a 941px-tall file, and five photos serve 16 heroes. Swapping is one import per photo in `src/data/photos.ts`.
- **Town for every photo.** Every caption carries "town CONFIRM".

## Deviations from the master prompt, by decision (carried from the design)

- Type floor is 16px everywhere (eyebrow, chips, captions, labels, footer). The master scale allows 12 to 15px there.
- Chips are 44px tall with the button radius.
- Trailing slashes always (master default is none).
- One uppercase element: the 16px eyebrow.
