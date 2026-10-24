# ADR-015: The roofline mark is a pitch and eave, not a caret

**Date:** 2026-10-24
**Status:** Accepted.

## Context

The design's one graphic is the roofline rule: a 24 by 10px stroke before every section eyebrow, at the top of the footer and on the pullquote card. The Gate A export drew it as a bare symmetric caret (`M1 19 L24 3 L47 19`). On the live site Sam read it as an accordion or dropdown control next to "WHY US" and "SERVICES", and a visitor will too: an open caret is the glyph every select, disclosure and "back to top" link uses. At the top of the footer, centered, it looked like a scroll-to-top button.

Seven alternatives were compared on the light and navy bands at 1x and 3x (closed gable, outline and solid; overhang with wall ticks; ridge line from the RC mark; pitch and eave; a bare rule). Anything with a chimney was ruled out as tacky before drawing.

## Decision

The mark is a pitch and eave drawn in one stroke: the gable at the left, the eave running flat to the right, round caps.

```
viewBox 0 0 48 20, stroke 3 (2 on the 48px footer and pullquote sizes), round joins and caps
M2 18 L14 4 L26 18 H46
```

The same path is used in `Eyebrow.astro`, `Footer.astro` and the `ReviewCard` pullquote, so the brand has one roofline, not three. It is asymmetric, so it can never be mistaken for a control, and the flat run makes it read as a rule beside the label rather than a glyph above it.

## Consequences

- `design/` is read-only, so the change is logged in `DESIGN-DEBT.md` (fix 8) against the eyebrow and footer artboards.
- Master prompt section 9 (kill list) now bans a bare symmetric caret as a decorative or brand mark, and section 7 names the roofline rule's shape for home-service builds.
- No token, copy or layout change. Both gates unaffected; the mark keeps its 24 by 10 footprint.
