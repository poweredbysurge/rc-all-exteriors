# ADR-022: City pages never stack two text-only bands

**Date:** 2026-11-04
**Status:** Accepted. First test of the Surge page templates (workspace `templates/website-build/PAGE-TEMPLATES.md`, test log 1).

## Context

Measured at 390px, Fairfax Station ran two local-angle sections back to back with no visual: Permits and HOA rules (880px) and Cedar shake (851px), 1,731px of plain text. The cost drivers rendered as a bullet list. Spacing, type size, schema and photos all passed.

## Decision

1. **A local-angle section may carry one registry photo** (`extraPhotos` in `[city].astro`, keyed by city and section name). It renders as a split, photo first on phones (full-bleed to the gutter), photo left on desktop. Only a photo of the section's own subject, never one already in the proof block or the service cards.
2. **Fairfax Station's Cedar shake section takes `shakeInstall`** (Brava synthetic shake going on a mansard roof). It is not used elsewhere on that page.
3. **"What drives the price" renders as cards** when every item opens with a short titled sentence (`asTitled`): the title is the card heading, 1 column on phones, 2 from 768px. Otherwise it falls back to `Bullets`. Alexandria picks this up too.

## Consequences

- Fairfax, Lorton and Springfield have no local-angle or price sections and are unchanged.
- `check-integrity` passes on all 36 pages.
- Fairfax Station is 690px longer on a phone; the added height is photo and cards.
- Open: footer Company and Resources lists side by side on phones (sitewide); Lorton and Springfield share 75% of their text in the swap test.
