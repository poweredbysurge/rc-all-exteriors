# ADR-024: Rotating hero styles (PAGE-TEMPLATES rule 15)

**Date:** 2026-11-11
**Status:** Accepted. Publishes when Mario pushes main, after a local build and the gates pass.

## Context

Mario reviewed the November pages across clients and asked that pages stop sharing one hero. He picked four styles from ten mocked in Claude Design: split, stats bar, before and after, and estimate form. `PAGE-TEMPLATES.md` v1.6 records them as rule 15: neighbors never share a style, and every style keeps the H1, lede, primary button and rating.

This site already has two heroes: the photo hero with the lead card (`Hero.astro`: home, services, cities, the offer page) and the text hero (`PageHero.astro`: guides, hubs, trust and legal pages).

## Decision

1. **The photo hero with the lead card is this site's estimate form style.** It stays as designed at Gate A. `/insurance-claims/` and `/service-areas/arlington-va/` keep it.
2. **`PageHero` takes an optional `photo` and becomes the split style.** Copy on the left, one registry photo on the right from 1024px in a 4:3 frame (460px), under the copy on phones. It uses `Figure`, so the photo comes through the image pipeline with its registry caption. The photo is lazy: the H1 stays the LCP element, the route stays `text` in `LCP_MAP`, and no image preload is owed.
3. **`/guides/roof-replacement-cost/` is the first split hero**, with `twoStory`. The route map is `HERO_PHOTO` in `ArticlePage.astro`.
4. **`/guides/gutter-installation-cost/` and `/guides/storm-damage-checklist/` keep the text hero for now.** The registry has no gutter photo and no storm damage photo, and a roof replacement photo on either would misdescribe the page. They switch when Ricardo's photos arrive.
5. **The stats bar and the before and after styles are not built here yet.** A stats bar needs numbers from the copy, and the city pages already carry a stat strip in Why us, so lifting it into the hero is a copy and rhythm change, not a styling one. A before and after needs one job shot twice from the same spot; the Fairfax Station skylight pair is the only real pair and it belongs to that city's proof block.

## Consequences

- `data-hero-style` (`text` or `split`) is on the hero for the gate and for later audits.
- `design/` is untouched. The deviation is logged in `DESIGN-DEBT.md`.
- This change was written without a local build (the session could not run the Mac build tools). Build, `check:production`, `check:layout` and `audit:rhythm` must pass before the push. Look at the guide at 390 and 1440: the caption under the hero photo sits on the dark surface and should read as inverse text.
