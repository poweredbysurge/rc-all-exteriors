# ADR-004: Schematic service-area map, and the mobile hero photo

**Date:** 2026-10-07
**Status:** Accepted at build; either can be reopened at preview review

## 1. The service-area map stays schematic

Gate A review finding 7 left this to the build: a static map tile centered on 22192 with the dot overlay, or the schematic if the tile reads generic.

**Decision: schematic.** Towns are plotted by latitude and longitude from `src/data/nav.ts`, the home base carries the RC mark, live city pages are solid dots.

Why: a static tile needs a map provider key and an image request to a third party (or a checked-in raster, which is a PNG or JPG the gate forbids). A tile at this zoom is mostly highway shields and reads like every other contractor's embed. The schematic is 0 requests, on brand, and it cannot show a street address by accident.

To reopen: `AreaMap.astro` is the only file. Swap its body for a tile and keep the overlay.

## 2. On phones the hero photo sits behind the headline, not the whole hero

The artboard stretches one landscape photo behind a stacked mobile hero that is about 2,000px tall (Gate A review finding 2).

**Decision:** below 1024px the photo is a 3:4 crop behind the headline block, with a 60% scrim to the 40% line (review finding 3) fading to the solid dark surface. The lead card sits on the dark surface.

Why: covering 2,000px of height with a landscape file means scaling it about 5x, which is either a blurry LCP image or a 300KB one. The 3:4 crop is sized to the viewport width, so a phone downloads a 30 to 90KB AVIF. The artboard's scrim already reaches 92% at the bottom, so the look is the same from the card down.

Logged in `DESIGN-DEBT.md` so it can be fixed upstream.
