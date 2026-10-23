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
| 7 | Schematic map | Replaced by a styled Google static map with our pins on top (ADR-010, 2026-10-23). The artboards still show the schematic. | home, fairfax |
| 8 | tear-off.jpg is an underlayment shot | Source renamed `rc-select-03-underlayment.jpg`; registry key `underlayment`. | home, roof-replacement |
| 9 | Hero photo has the RC mark baked in | **Fixed 2026-10-19.** Hero source is the unwatermarked colonial street view from Ricardo's phone, with a pre-cut 16:9 band (`heroSrc`) for desktop because the image service crops portrait sources through the middle. | home |
| 10 | Section padding 100px / 128px | From `design/tokens.css` through the generated theme (`section-y`, `section-y-quiet`). | all |

## Live review, 2026-10-19 (ADR-005). Fix upstream in the next Mode A export

- **Hero is contained to the first viewport on desktop.** Height is the viewport minus the header, clamped 640 to 820px, 40px padding, content centered. The artboards draw the hero at 640px min inside 128px section padding, which overran 900px windows. Artboards: home-1440 and every *-1440 hero.
- **Trust row is a light strip under the hero**, not a row inside it. Chip plus three items on desktop, chip plus two on phones. Artboards: every hero.
- **Homepage display H1 is one step under the display token** (max 60px, was 72px). Artboard: home-1440.
- **Lead card step 1 is two panes** (reason as option rows, then contact) with a counter, progress bar and Back; step 2 is one question per pane. The artboards draw step 1 as one tall form. Artboards: lead-card-step1, lead-card-step2, home-1440 card.
- **Header is dark** (`surface-contrast`), 88px / 72px with the white lockup at 56px / 44px, inverse CTA; the mobile panel is dark. The artboards draw a white 80px header with the colour lockup at 40px. Artboards: header-1440, header-390, nav-open-390.
- **Homepage section order**: services second, image-led cards on a dark band; problem opener third; financing on a dark band with a photo. Artboards: home-1440, home-390.
- **New tokens** in `brand/tokens.overrides.css` (header heights, logo heights, hero min and max, quiz bar). `design/tokens.css` is unchanged; the generated theme reads both.

## Inner-page rhythm, 2026-10-19 (ADR-006). Fix upstream in the next Mode A export

- **Service, trust, city and offer pages carry a job photo beside the opening section and one dark content band in the first half**, planned from the copy's section kinds. The artboards draw the inner pages as a light cycle with the CTA band as the only dark surface. Artboards: roof-replacement-1440, fairfax-1440, free-roof-inspection-1440 and their 390 pairs.
- **The CTA band on short service pages sits below the FAQ**, not after the process section, so two dark bands never sit a section apart.

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
