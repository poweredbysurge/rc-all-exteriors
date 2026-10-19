# ADR-006: Inner pages get the homepage's rhythm

**Date:** 2026-10-19
**Status:** Accepted. Promoted to MASTER-WEBSITE-PROMPT v1.3 (sections 5 and 18) the same day.

ADR-005 fixed the homepage. Sam's next look at the preview: the inner pages "lack depth". The audit agreed. Every service page was 1,500 to 1,900 words with one photo (the hero) and no dark surface until the CTA band; the homepage had twelve photos and three dark bands.

## Decision

Every page laid out from copy sections (the eleven service pages, the trust pages, the city pages and the offer page) gets two things, planned by `src/lib/rhythm.ts` rather than placed by hand:

1. **A real job photo beside the opening section.** The first body section, when it is prose or a split, renders as photo left and copy right. The photo is the first registry photo of the page's own job type that is not the page's hero photo, rotated by route so sibling pages open on different pictures. Commercial draws from the commercial set; everything residential draws from the roof replacement set, which is the only finished-house photography we have until Ricardo's originals land.
2. **One dark band in the first half of the body.** Preference: an icon-block grid, then a split, then the process steps (the photos sit well on the dark surface). Never the opening section, never a section with an attached quiet sub-band (roof replacement's table and materials rows), and always with at least two light bands between it and the closing CTA band. When the CTA band's natural spot (after the process section) would be within one band of the dark section, the band moves below the FAQ. Pages with fewer than three body sections keep the light cycle; the CTA band is their dark one.

Text on the dark band goes inverse through one unlayered rule on `.on-dark` for the `text-fg`, `text-fg-muted`, `text-fg-subtle`, `text-accent` and `bg-accent` utilities, skipping anything that paints its own light surface (lead card, `.card`, the dropdown panel, boxed stat strips). Components did not need per-case dark variants.

The light cycle starts one step in on photo-hero pages, so the opening section is a tint under the white trust strip.

City pages: the services grid is the dark band with the homepage's image-led cards. The offer page: "Who it is for" (white cards) is the dark band.

## Why not hand-place it

Eleven service pages come from one template. Hand-placing a dark band per page is the kind of polish this template exists to remove. The planner takes the copy's section kinds and produces the same result on the next client with no decisions.

## Left open

- With five photos, the opening photo repeats across pages and does not always match the service (a shingle roof beside the gutters intro). The slot is right; the inventory is the blocker (WORKING-ORDER, photo originals). Each page's owed photos still render as labeled gaps with `data-confirm`.
- The audit script (`scripts/audit-rhythm.mjs`) prints each page's surface sequence and photo count. It is a report, not a gate, until the rule has survived a second client.
