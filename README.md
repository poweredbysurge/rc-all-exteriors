# RC All Exteriors website

Production site for RC All Exteriors LLC (Woodbridge, VA roofing and exteriors). Built by The Surge Agency from the Surge master website prompt.

## Start here

1. `MASTER-WEBSITE-PROMPT.md`: the rules. Sections 1 to 18 bind every page. Section 20 is the build mode.
2. `GATE-A.md`: the design approval and the four decisions. Must be signed before code.
3. `MODE-B-PROMPT.md`: the kickoff prompt for Claude Code, with the INPUT BLOCK filled.
4. `design/`: the approved Claude Design export. Read-only. `design/tokens.css` is the token source, `design/LINK-MAP.json` the route map, `design/DESIGN-DEBT.md` and `design/GATE-A-REVIEW.md` the known gaps and fixes.
5. `copy/`: approved copy, five batches tagged by element, plus `SITEMAP.md` (28 launch pages, intent lanes, lead form reconciliation, locked business facts).
6. `brand/`: `brand.json` (facts, logo colors, direction block) and the logo SVGs.
7. `adr/`: decisions. ADR-001 (stack) is written on day one of the build.
8. `src/assets/photos/`: four 2400px selects to start. Originals from the RC Drive folder replace them before launch (see `PHOTO-INVENTORY.md` there).

## Stack

Astro 7 + Tailwind 4 on Vercel, trailing slashes always. Lead intake via same-origin `/api/lead/` to Resend and Surge Command Center. Reviews via the `/api/reviews/` proxy. See `adr/ADR-001-stack.md`.

## Where things live

- `src/lib/copy.ts`: parses `copy/batch-*.md` into the blocks every page renders.
- `src/data/business.json`: phone, hours, service area, licence. One edit changes the site.
- `src/lib/site.ts`: LAUNCH / LIVE hosts and the consent text version.
- `src/data/photos.ts`: photo registry and the LCP map.
- `src/data/nav.ts`: services, cities, routes, breadcrumbs.
- `scripts/check-integrity.mjs` and `scripts/check-layout.mjs`: the verification gate.
- `WORKING-ORDER.md`: what is done, blocked, and the commands to resume.
- `CONFIRM-LIST.md`: every open question for Ricardo, by page.

## Working rules

- Copy is verbatim from `copy/`. Every `[CONFIRM]` renders as a visible placeholder in preview and fails the integrity check for production.
- No street address anywhere. Service-area business.
- 18px body floor. Section padding 100px mobile, 128px desktop (`design/tokens.css`).
- No em dashes in any file.
- `WORKING-ORDER.md` is updated at the end of every session.
