# ADR-002: Design direction

**Date:** 2026-10-05
**Status:** Accepted
**Decided by:** Sam Delgado
**Supersedes:** none · **Amended 2026-10-07:** open slots filled from the Gate A tokens page

## Decision

RC All Exteriors is built in **Direction C, "Crew"**: wide geometric grotesque heading face at 700 in sentence case, neutral sans body, more white space, modern pacing. Harmonizes with the logo wordmark (wide, bold, uppercase geometric) rather than contrasting it.

| Token | Value | Source |
|---|---|---|
| Heading face | Archivo, Expanded width (variable `wdth` 125), weight 700, sentence case. `font-family: Archivo; font-stretch: 125%; font-weight: 700; line-height: 1.02; letter-spacing: -0.015em`. Load `family=Archivo:wdth,wght@125,700` | Direction C board |
| Body face | Manrope 400 body, 500 secondary, 600 labels and chips, 700 button labels. 18px / 1.6 body, 16px floor | Direction C board |
| Font source and licence | Google Fonts, SIL OFL. Self-host as subsetted woff2 (Archivo variable with wdth axis, Manrope 400/500/600/700) | |
| Accent | #0F2ACE (logo blue) | brand.json, fixed |
| Accent hover | #0B21A6 (press #081A85) | tokens page, 2026-10-08 |
| Accent tint | #EEF0FC | tokens page, 2026-10-08 |
| Dark surface | #0A1030 (also fg; neutrals derive from it) | tokens page, 2026-10-08 |
| Radius | sm 6px (checkbox, tags) · md 10px (buttons, chips, fields) · lg 14px (cards, photos, panels) | tokens page, 2026-10-08 |
| Body size | 18px / 1.6 | master prompt section 4, floor |

## Why

- The wordmark is wide and geometric. A wide grotesque heading reads as the same family of shapes, so the logo sits in the layout instead of on it.
- The brief's second reader (20-year-old roof, comparing three companies on the couch at 9pm) is the one a new site wins or loses on. Direction C is built for that reader. The storm-damage reader is served by the sticky phone and the hero form regardless of direction.
- Light default and white space let the one strong blue carry the whole palette without a second accent.

## Rejected

- **Direction A, "Trade"** (condensed uppercase display, industrial). Contrasts well with the wordmark and serves the urgent reader, but reads closer to every other roofer in the market. The blue does less work against heavy condensed type.
- **Direction B, "Established"** (serif or slab). Strains for a company whose LLC may be one year old; the sturdy-heritage feel invites the tenure question we cannot answer yet.

## Note on the pairing

Archivo plus Manrope is also The Surge Agency's own pairing (Archivo 900 uppercase, Manrope body, lime on black). RC uses Archivo Expanded 700 in sentence case with royal blue on white. Different weight, width, case and palette, so it does not read as Surge. Accepted with that awareness; if it ever drifts toward uppercase 900, revisit.

## Consequences

- Tokens page in Mode A is drawn from the Direction C board. No re-litigation of typography after Gate A.
- Fonts are self-hosted as subsetted woff2 in the repo with metric-matched fallbacks before Mode B starts.
- `brand-kit/brand.json` gets a `direction` block with these values; old-site values move to `legacy`. `design-tokens.css` is regenerated from the tokens page.
- If Ricardo's tenure answer turns out to be strong (10-plus years as an operator), Direction C still holds. Tenure becomes a trust-row line, not a reason to go back to B.
