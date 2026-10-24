# ADR-011: Brand strip, composed share card, and the "exteriors too" line

**Date:** 2026-10-23
**Status:** Accepted. Promoted to MASTER-WEBSITE-PROMPT v1.4 the same day.

Sam's pre-launch list: the share card was the watermarked GBP cover with a wordmark; the homepage had no brand logos where HomeSource has a badge strip; and the first screen read as a roofing-only company.

## 1. Brand strip under the hero

`BrandStrip.astro` renders `src/data/brands.ts`: CertainTeed, Brava, BBB, James Hardie, ProVia, VELUX, Enhancify. Every entry is a relationship Ricardo confirmed in the launch answers (ADR-007); a logo for a product the crew has not installed never ships. Marks are the brands' own files (Brava, VELUX, BBB and Enhancify from their sites on 2026-10-23, CertainTeed, James Hardie and ProVia from the HomeSource repo), nothing redrawn. SVGs inline, rasters through the image pipeline as WebP. Grayscale at rest, the brand's color on hover, each logo a 44px-tall link to the page about that product or credential. One quiet white band directly under the trust strip, before the dark services band.

The BBB mark is the primary logo, not the Accredited Business seal. The seal is issued per business; Ricardo gets it from his BBB dashboard and it replaces the logo when it arrives.

## 2. The share card is composed, not generated

`scripts/generate-og.mjs` renders an HTML template in headless Chrome (same `CHROME_PATH` and `CHROME_ARGS` as `check-layout`) using the site's own fonts and tokens: the unwatermarked hero photo under the scrim, the white wordmark, one short line, "Class A licensed · 10-year workmanship warranty", a white Google chip with yellow stars and the rating and count, and the roofing credential marks (CertainTeed, Brava, BBB) in white. The count rounds down to the nearest ten with a plus ("50+") so the static card does not drift from the live chip.

Why not an image model: it mangles letterforms and real logos, and a generated CertainTeed or BBB mark on a public share card is a fabricated trademark. Real assets exist; compositing them is a build step.

## 3. The "exteriors too" line

Under the hero CTAs, from the copy (`[P]` in the Hero section of batch-1): "Roofing is most of what we do. We also handle siding, gutters, and windows and doors, often on the same job." with links to those pages. Small type, muted inverse, inside the first viewport on desktop and above the lead card on phones. The H1 stays on roofing, which is the search intent; the line is for the visitor, not the ranking.
