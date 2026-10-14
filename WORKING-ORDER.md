# Working order: RC All Exteriors

## 2026-10-07, session 2: Mode B build to the verification gate

**Done**
- Build order steps 1 to 11 of `MODE-B-PROMPT.md`. Astro 7 + Tailwind 4, static, Vercel adapter (ADR-001).
- 29 pages built: home, 11 service pages, `/free-roof-inspection/`, 3 city pages, `/services/`, `/service-areas/`, `/warranty/`, `/financing/`, `/about/`, `/contact/`, `/reviews/`, `/projects/`, 3 legal pages, `/thank-you/` (noindex), 404. Case study template is in place and generates from `src/data/projects.ts` (empty: no real jobs supplied yet).
- Copy is parsed from `copy/batch-*.md` at build (`src/lib/copy.ts`), never retyped. FAQPage schema comes from the same blocks as the accordion.
- Chrome: header (fits 320 to 1920, nav from 900), services dropdown, mobile nav panel, sticky bottom CTA, footer with 44px rows and `data-dni-skip` NAP.
- Lead card: both steps, success, inline errors, loading, honeypot, 3-second floor, localStorage retry, attribution cookie, GA4 gating. `/api/lead/` fans out to Resend and Command Center. `/api/reviews/` proxies Google Places with the confirmed fallback.
- `business.json`, LAUNCH / LIVE in `src/lib/site.ts`, LCP preload map, host-aware `robots.txt`, `sitemap.xml` with git lastmod, edge middleware noindex on non-production hosts.
- Gate A review fixes 1 to 8 and 10 applied (`DESIGN-DEBT.md`). Fix 9 is blocked, below.
- `deploy/redirects.json` authored from the old site's `wp-sitemap.xml`, parked behind `doNotDeployYet`.
- ADR-001 (stack), ADR-003 (lead form contract), ADR-004 (schematic map, mobile hero). `STANDARDS.md` (24 candidates), `DESIGN-DEBT.md`, `copy/DRAFT-ADDITIONS.md`, `CONFIRM-LIST.md`.

**Verification gate, measured 2026-10-07 on the local build**
- `npm run check`: passes. 29 pages, 27 indexable, every page has 28 inbound link sources, no keyword collisions, swap test 56% / 56% / 74% (limit 80%).
- `npm run check:layout`: passes. 28 pages at 15 widths (320 to 1920): no overflow, 18px body floor, header switch at 900, 44px tap targets, sticky CTA behavior.
- Lead form, driven in headless Chrome against `astro dev` with a mock Resend and a mock Command Center endpoint: invalid submit focuses the first bad field; sub-3-second submit and honeypot give a fake success with no request; a real submit posts once, sends the notification (to and cc), forwards with `source_detail` and `external_id`, fires `generate_lead` with enum params only; step 2 posts `step: 2` and fires `lead_qualified`; a failed request shows retry copy with the phone number and queues the payload.
- Lighthouse mobile, local static server: `/` 99 / 94 / 96 / 100, `/roof-replacement/` 99 / 100 / 96 / 100, `/service-areas/fairfax-va/` 99 / 94 / 96 / 100, `/free-roof-inspection/` 98 / 100 / 96 / 100 (performance / accessibility / best practices / SEO). LCP 2.1 to 2.4s, CLS 0, TBT 0ms, 217 to 271KB page weight. The two 94s were a `<dl>` structure fault in the stat strip, fixed after that run and not re-measured. Best practices 96 is a console 404 for `/api/reviews/`, which the static server does not serve.

**Not verified**
- Nothing has run on Vercel. No preview deploy exists: there is no `rc-all-exteriors` project under the `poweredbysurge` team and the repo is not linked (prerequisite 5). So: edge middleware noindex, host-aware robots.txt, `/api/lead/` and `/api/reviews/` as functions, and Lighthouse on the real host are all untested in production conditions.
- No email has reached a real inbox. `RESEND_API_KEY` and `LEAD_NOTIFY_TO` are not set anywhere; the form was proven against a mock only.
- Live reviews. No `GOOGLE_PLACES_KEY` or `GBP_PLACE_ID`, so every review slot is a placeholder and the count is the confirmed 49.
- Screenshot diff against the Gate A artboards was by eye on home, roof-replacement, contact and the mobile hero, not pixel-diffed.
- INP has no field data yet.

**Blocked**
- **Vercel project.** Create and link it, then set env vars: `RESEND_API_KEY`, `LEAD_NOTIFY_TO` (Ricardo's address, CONFIRM), `LEAD_NOTIFY_CC`, `COMMAND_CENTER_TOKEN`, `GOOGLE_PLACES_KEY`, `GBP_PLACE_ID`, `PUBLIC_GA_ID`. Optional: `COMMAND_CENTER_URL`, `LEAD_REPLY_FROM`. After the first deploy, put the real preview host in `LAUNCH` in `src/lib/site.ts` (it is a guess today: `https://rc-all-exteriors.vercel.app`).
- **Photo originals** from the RC Drive folder. Only the five selects are in the repo. The homepage hero still has the RC mark baked in (Gate A review finding 9), and five photos cover 16 heroes. Drop originals in `src/assets/photos/`, run `npm run optimize-images`, update imports in `src/data/photos.ts`.
- **Ricardo's answers.** 121 distinct CONFIRM slots, 222 placements (`CONFIRM-LIST.md`). City pages must not publish without one real local job and one local review each.
- **Legal text** on `/privacy-policy/`, `/terms/`, `/sms-terms/` is a Surge draft and carries a CONFIRM slot until RC approves it.
- **Copy lengths for the copy owner** (8): titles on `/about/` (62), `/contact/` (67), `/warranty/` (61); descriptions on `/reviews/` (137), `/roof-repair/` (175), `/service-areas/fairfax-va/` (131), `/service-areas/` (185), `/skylights/` (137). Verbatim from the batches, so not changed here.

**Decisions made this session that Sam may want to reverse**
- Service-area map stays schematic (ADR-004).
- Mobile hero photo is a 3:4 crop behind the headline (ADR-004).
- `business.json` address is locality and region only, no postal code (CLAUDE.md rule 4 says "only"; batch-1's schema note lists 22192).
- Nothing is committed. All work is in the working tree on `main`.

**Next**
1. Review locally: `npm run build && npm run preview`, open http://localhost:4321.
2. Create and link the Vercel project, set env vars, deploy a preview, fix `LAUNCH`.
3. On the preview: send one real lead to a test inbox; check `robots.txt` says Disallow and the `X-Robots-Tag` header is present; run Lighthouse on the four gate pages.
4. Send `CONFIRM-LIST.md` to Ricardo. Pull photo originals.
5. Launch protocol is a separate session.

**Resume commands**
```
cd ~/Surge-Cowork/repos/rc-all-exteriors && git status && cat WORKING-ORDER.md
npm install
npm run build            # astro build, then prunes original JPGs from the output
npm run preview          # static server on :4321 (no API routes)
npm run dev              # dev server with /api/lead/ and /api/reviews/
npm run check            # integrity gate, preview mode
npm run check:layout     # rendered gate, needs `npm run preview` running
npm run check:production # same gate, CONFIRM slots and a non-LIVE host fail
node scripts/sync-tokens.mjs        # after any change to design/tokens.css
node scripts/measure-fallbacks.mjs  # after a font change
node scripts/generate-og.mjs        # after a hero photo or logo change
```

## 2026-10-07, session 1 (repo seeded, no code yet)

- Repo seeded from the workspace: `design/` (Gate A export, 27 artboards, padding amended), `copy/` (5 batches + SITEMAP), `brand/`, `adr/ADR-002`, master prompt v1.2, Mode B prompt, photo selects, README, CLAUDE.md.
- `GATE-A.md` signed by Sam 2026-10-07, four decisions approved as written. `design/` is read-only.
