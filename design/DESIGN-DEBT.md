# DESIGN-DEBT.md: RC All Exteriors Mode A, Gate A export

Date: 2026-10-07 · Direction C "Crew" (ADR-002) · iteration 01 system applied to every page · artboards in `pages/<artboard>/index.html`

Everything the design could not resolve, each tagged with the artboard it lives on. Nothing here blocks Gate A review; the CONFIRM slots block launch.

## Photo gaps (drawn as surface-subtle blocks with a 32px icon and a "Photo:" caption)

- Written estimate on the kitchen table · home-390, home-1440, roof-replacement-390, roof-replacement-1440, components (process step 2)
- Metal roof · roof-replacement-390, roof-replacement-1440, tokens (placeholder sample)
- Ricardo on a roof during an inspection · free-roof-inspection-390, free-roof-inspection-1440
- Sample page from an inspection photo report · free-roof-inspection-390, free-roof-inspection-1440
- Fairfax job, before and after · fairfax-390, fairfax-1440 (two selects stand in, captioned as placeholders for a Fairfax job)
- Siding, gutters, windows, crew, Ricardo portrait, truck: no slot drawn on any artboard because no copy on the drawn pages calls for one; the service cards use icons. Needed for /siding/, /gutters/, /windows-doors/, /about/ in Mode B.
- Hero on home-390 and home-1440 uses the GBP cover, which has the RC mark baked in at bottom right. Mode B uses the unwatermarked source.
- tear-off.jpg is an underlayment-install shot, not a tear-off. Used for process step 3 on home and roof-replacement; caption says "in progress, underlayment".
- Captions name the job type from the Drive folder names only. No town is known for any select, so every caption carries "town CONFIRM". Never guess the town.

## CONFIRM slots, by artboard (drawn as dashed text with the CONFIRM tag)

- home-390, home-1440: owner on every job · Ricardo shares inspection photos · rotted decking policy · property protection and nail sweep steps · usual wait for an inspection · typical install time · final walk-through step · financing partner and terms · price range (FAQ) · license number (FAQ) · deposit schedule (FAQ)
- roof-replacement-390, roof-replacement-1440: decking inspection and rotted-wood policy · price range and deposit schedule (pricing card) · warranty document check · most homes take X days · warranty registration step · financing partner and terms · range (FAQ) · X days (FAQ) · do I need to be home · final walk-through · rotted decking policy · deposit schedule
- fairfax-390, fairfax-1440: rotted decking policy · 1 to 2 sentences on Fairfax homes · description of a real Fairfax job · Fairfax review (striped block) · neighborhood names (six chips) · typical wait for an inspection · license number (trust bar)
- free-roof-inspection-390, free-roof-inspection-1440: attic check included · photo report included · usual lead time · callback hours · 30 to 60 minutes · same day answer · do I need to be home · pre-purchase inspections
- lead-card-success, thank-you-390, thank-you-1440: callback hours
- footer-390, footer-1440 and every footer: licence number
- All review cards and pullquotes (home, fairfax, components, tokens): verbatim Google text via the reviews proxy. Never typed in.
- Service-area map (home, fairfax, tokens): schematic dots by lat/lon. Mode B swaps in a static map tile centered on 22192.
- Fairfax page must not publish without one real Fairfax job and one Fairfax review (batch-5 rule).

## Deviations from the master prompt, by decision

- Type floor: the master scale has eyebrow 12 to 13px, mono 13 to 14px, chips 14 to 15px; iteration 01 asked for 13px eyebrows. The finalize brief says nothing under 16px, so eyebrows are 16px uppercase with 0.08em tracking (was 0.12em at 13px), and mono, chips, labels, captions and footer links are 16px. Recorded on the tokens artboard. Tailwind `fontSize` entries for eyebrow and mono should be 1rem.
- Chip height 44px (master: 32 to 40px) because city chips are links and need a 44px target. Chips use radius-md (10px), same as buttons; the Direction C board showed pills.
- Uppercase appears in one place only: the 16px eyebrow with the roofline rule. Everything else is sentence case.
- Header nav follows the batch-1 site-wide spec (Services · Service Areas · Warranty · Financing · Reviews · About) rather than the Mode A prompt list (Services · Service Areas · Reviews · About · Contact). Contact is in the mobile panel and footer. Still open; pick one before Mode B. Artboards: header-1440, header-1920, nav-open-390.
- Hero scrim is the only gradient. Hero on 390 stacks copy then card; on free-roof-inspection-390 the lead card sits directly under the lede so the form is above the fold, with the call button and trust bar below it.
- "7 service cards" (iteration prompt) vs 4 in batch-1 §2: drawn as 4. "Three steps" vs 4 [STEPS] in the copy: 4 drawn.
- Fairfax breakers: the approved copy is about 450 words plus CONFIRM slots, not 900 to 1,200. Breakers (photo strip and review, stat strip, chip cloud) sit where they will land once the CONFIRM paragraphs are filled.
- Service hub "city links" row adds one line of connective copy ("Based in Woodbridge. Serving Lake Ridge and the neighborhoods around our home base, plus:"). Not from the batch files; replace or cut. Artboards: roof-replacement-390, roof-replacement-1440.
- Related services on the service hub use batch-4 services-hub card copy (no related-services copy exists in batch-1 §3).
- "Repair or replace" table rows use phrasing from the roof repair FAQ (batch-1 §4) and the replacement insurance FAQ (§3). Three rows, nothing invented.
- "What happens next" timeline on the inspection page adds a second row ("We confirm a time") built from the copy's confirmation sentence. Cut it if that is a stretch.
- Section eyebrows ("Why us", "Services", "Reviews", "Service area", "What is included", "Recent work") are the copy document's own section labels. DRAFT; cut any that read as filler.
- 404 and thank-you copy is written to section 16 rules and is DRAFT. Thank-you reuses the lead card's confirmation sentence.
- Lead card step 2 radio labels ("Right away", "Within a month", "1 to 3 months", "Just planning") map to the master's urgency keys; "Best time to reach you" is a select. Email is on step 1 per the SITEMAP reconciliation. The step 2 street address field shows a sample value ("12 Example Ct"); it is the homeowner's address, never RC's.
- Lucide paths are redrawn and may differ by a pixel from the npm package. Mode B installs lucide (ISC) and uses the names on the tokens artboard.

## States not drawn

- Header at 768 to 899 (tablet hamburger band): same as header-390 with a 20px gutter. Header below 360 not drawn; at 320 the homepage display size (40px) wraps the H1 to six lines; consider 36px below 360.
- Services dropdown open on desktop (nav-open-390 shows the expanded pattern; header-1440 shows the chevron only).
- Footer services accordion expanded on mobile (footer-390 shows it collapsed with a note).
- Scroll reveal, hover transitions and focus order. Hover and focus are drawn as static frames on the tokens artboard.
- Hover states for the callout, timeline and stat strip: they are not interactive and have none.
- Lead card below 480 when swapped for a reviews card plus the sticky bar (master allows it); the 390 artboards keep the full card, about 820px tall with the SMS consent text.
- Emergency Roof Repair hero variant with the phone CTA primary (template swap only).

## Changed after export (Gate A, 2026-10-07)

- Section padding: mobile 48px raised to 100px on every content section of the 360 and 390 artboards; desktop 96px raised to 128px. tokens.css updated. Annotations now read `py-[100px] (100px)` and `lg:py-32 (128px)`. Pages re-rendered; home-390 grew from 13,644px to 14,788px. Master prompt v1.2 carries the rule forward.

## Open decisions for Sam before Mode B

- Header nav item list (batch-1 spec vs Mode A prompt list), above.
- Keep or cut the connective sentence on the service hub city-links row.
- Keep or cut the "We confirm a time" timeline row on the inspection page.
- Keep or cut the six section eyebrows.
