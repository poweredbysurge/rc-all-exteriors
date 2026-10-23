# ADR-010: Service-area map on a styled Google static map

**Date:** 2026-10-23
**Status:** Accepted. Supersedes ADR-004 item 1. Promoted to MASTER-WEBSITE-PROMPT v1.4 the same day.

Sam on the first live build: the schematic "looks very one-dimensional and broken". It was a diagram, not a place. ADR-004 chose it to avoid a provider key and a third-party request; both reasons have gone away since the reviews work put a Surge Google Cloud key on the project and the image pipeline learned to fetch remote images at build.

## Decision

`AreaMap.astro` draws its background from the Maps Static API, styled in the site palette, fetched once at build through `getImage` (`image.domains` allows `maps.googleapis.com`) and emitted as a local WebP. The page makes no request to Google, loads no script, and the key never leaves the build. Our own pins and labels sit on top, placed by the same Web Mercator projection at the same integer zoom and centre Google drew (`src/lib/static-map.ts`), so a pin lands on its town. Live city pages stay solid dots, the home base keeps the RC mark, labels get a white halo over roads and water.

Style: Google's labels, POIs, transit and borders off; land, water, roads, highways and parks in five tokens (`--map-*` in `brand/tokens.overrides.css`) so the tile reads as part of the site, not an embed. Google's logo and copyright stay on the tile, which is the attribution the terms ask for.

Fit: the largest integer zoom at which every place fits inside the padded image, centred so the bounding box sits in the padded area (labels need room on the right). City pages pass `only` and get their own corner at a closer zoom.

Keyless builds fall back to the schematic with its "Schematic, not to scale" caption, so a local build never fails for want of a map.

## Why not the interactive embed

The Maps JavaScript embed is 200KB+ of script and an external request on every page the module appears on (home, contact, service areas, every city page). The performance budget would take the hit sitewide for a map nobody needs to pan.

## Cost

One Static Maps request per map variant per build (four today), inside the free tier. The `rc-all-exteriors` key in `surge-client-sites` is restricted to Places API (New) and Maps Static API.
