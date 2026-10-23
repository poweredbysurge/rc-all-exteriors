# ADR-008: Face-safe crops, unnamed people, mobile polish

**Date:** 2026-10-23
**Status:** Accepted. Promoted to MASTER-WEBSITE-PROMPT v1.4 the same day.

Sam's review of the launch candidate on his phone: a person's head cut off in the process steps, two hero buttons side by side, and three photos captioned "Ricardo" that are his brother-in-law.

## 1. Crops anchor on the people

`sourceSet` cropped every derivative with sharp's default centre anchor. A portrait photo of someone standing on a roof, cut to 4:3 for the steps row, loses the head. `photos.ts` now carries `focus` (`top`, `bottom`, `left`, `right`) on every photo with a person, and `Figure` and `ServiceCard` pass it through. Nine photos set it: `top` for the standing and kneeling shots, `bottom` for the two where the crew is low in the frame. Checked by contact sheet at 16:10, 3:2 and 4:5 before and after.

Why not sharp's `attention` strategy: it anchored on the sky and the shingles in both tests. A named edge is deterministic and reviewable.

## 2. Nobody is named under a photo

Keys `ricardoRoof`, `ricardoYardSign`, `ricardoFlatRoof` became `proOnRoof`, `proYardSign`, `proFlatRoof`. Captions and alts say "an RC All Exteriors professional", "the RC All Exteriors crew", "on site". The owner's name stays in the copy ("Ricardo quotes every job and signs off on every roof"), which is a claim about the business, not about who is in the picture. The free inspection caption is "Every inspection is done in person, on the roof." Sam confirmed the yard sign shot is the brother-in-law and the roof walk is Ricardo, so the About hero and the homepage Why us photo (beside "That's how Ricardo Castro runs RC All Exteriors") use the roof walk; the yard sign shot stays in the process row as step 2. Step 1 is the chimney flashing detail so the roof walk is not twice on the homepage.

## 3. Mobile hero

CTAs stack full width until `lg` (was side by side from 480px). The mobile scrim drops from 60 to 45 percent over the top third with a 1px text shadow on the H1 and lede, so the first screen opens on a roof instead of a navy block. Desktop scrim unchanged.

## 4. Repair or replace table

Stacks into one card per row below 640px (`data-stack` on the wrapper, `data-label` on the cells, CSS only). The global `.table-wrap` keeps its horizontal scroll for wider tables.

## 5. Empty states and links

The reviews wall without the Places key renders one card linking to the Google profile, with a "Leave a Google review" chip beside the page chips. The contact list's Instagram and Facebook entries are markdown links in `copy/batch-2.md`.

## What did not change

The 100px / 128px section rhythm (already in the prompt since 1.2), the lead contract, the hero containment gate, the copy outside the two list items and one caption.
