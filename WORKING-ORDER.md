# Working order: RC All Exteriors

## 2026-10-23, session 4: mobile polish and people photos (ADR-008)

**Done**
- Face-safe crops: `focus` on every person photo in `photos.ts`, passed from `Figure` and `ServiceCard` into `sourceSet`. The homepage step 1 photo no longer cuts the head off.
- People unnamed: keys `proOnRoof`, `proYardSign`, `proFlatRoof`; captions and alts say "an RC All Exteriors professional" or "the crew". Inspection caption and About comment updated.
- Hero CTAs stack full width below `lg`; mobile scrim 45 percent with a text shadow on the H1 and lede.
- Repair or replace table stacks into cards below 640px (`data-stack`, `data-label`).
- Reviews page without the Places key: one card to the Google profile plus a "Leave a Google review" chip. Contact list: Instagram and Facebook as links (batch-2).
- Docs: ADR-008, STANDARDS 41 to 47, master prompt v1.4 (repo, workspace copy, Project doc).

**Round 2, same day: review cards (ADR-009)**
- Yellow stars (`--color-star`), reviewer photo through the image pipeline, "View on Google" link per review, eight-line clamp with Read more, live count replaces any literal count, fallback 53. Gate exempts review text from the exclamation rule; `REVIEWS_MOCK` for keyless layout checks. Verified with a saved Places response at 1440 and 390; both gates pass.

**Round 3, same day: service-area map (ADR-010)**
- `AreaMap` backgrounds are Google Static Maps styled in the palette, fetched at build, pins by projection. Maps Static API added to the `rc-all-exteriors` key. Verified keyless (schematic fallback); the real tile is checked on the Vercel build after push since the key is write-only on Vercel.

**Round 4, same day: launch list (ADR-011)**
- Brand strip under the hero (`BrandStrip.astro`, `src/data/brands.ts`): CertainTeed, Brava, BBB, James Hardie, ProVia, VELUX, Enhancify. Files in `src/assets/brands/`.
- Share cards composed from real assets in headless Chrome (`scripts/generate-og.mjs`); regenerated.
- Hero "also" line: roofing first, siding, gutters, windows and doors linked.
- `docs/COMMAND-CENTER-RUNBOOK.md`: the tenant, users, Resend and Vercel steps for next session. The form is not live until those env vars land.

**Round 5, same day: branded lead emails (ADR-012)**
- `src/lib/email.ts` frame; internal notification with Call, Text, Email buttons; homeowner confirmation. Vercel env set for to, cc and the two from addresses; `RESEND_API_KEY` is Sam's to paste, then a redeploy and a live form test. Command Center stays on the runbook.

**Round 6, same day: the lead API was dead on Vercel (ADR-013)**
- Edge middleware mode plus the trailing-slash 308 dropped every POST body. Adapter back to default mode; middleware in the function. Verify with a real POST after deploy.

**Check with Sam** (also in the session report)
- Settled: the yard sign shot is the brother-in-law, the roof walk is Ricardo. About hero and homepage Why us now use the roof walk; step 1 is the chimney flashing detail.
- The homepage dark steps band still shows four photos in a row; fine on desktop, long on phones. Could drop to two.
- Google reviews key: `surge-client-sites` Cloud project (manager@ account, billing linked 2026-10-23), key `rc-all-exteriors` restricted to Places API (New). Place ID `ChIJ_x_3BbtXtokRKZy7EsegsTE`. Sam pastes the key into Vercel as `GOOGLE_PLACES_KEY` with `GBP_PLACE_ID`, then redeploys; the review cards fill on the next build. The auto-created "Maps Platform API Key" (32 APIs, unrestricted) in the same project is unused and can be deleted.

**Next**
- Push from the Mac, then Sam's next callouts.

## 2026-10-19, session 3: live review round 1 (ADR-005)

**Done**
- Sam's review of the published preview against the old rcallexteriors.com. Five fixes, all promoted to MASTER-WEBSITE-PROMPT v1.3 (changelog at the bottom of that file) because every future build would have hit them.
- Hero contained to the first viewport on desktop (`Hero.astro`, `clamp(640px, 100svh - header, 820px)`), display H1 one step down, trust row moved to `TrustStrip.astro` under the hero.
- Lead card as quiz panes on the unchanged contract (`LeadCard.astro`, `src/scripts/lead.ts` `initPanes()`): pane 1 reason rows, pane 2 contact and consent (the step 1 POST), step 2 one question per pane with Next then Finish. Walked in headless Chrome against a mocked `/api/lead/`: tap advances, submit posts once, step 2 pages, Finish lands on success.
- Dark header and mobile panel, 88px / 72px, white lockup 56px / 44px, inverse CTA. Heights and logo sizes are tokens.
- Homepage: services second on a dark band with photo cards (`ServiceCard photo=`), problem opener third, financing on a dark band with a photo, surfaces alternate. `Eyebrow onDark`.
- `brand/tokens.overrides.css` for post-Gate-A tokens; `sync-tokens` reads it after `design/tokens.css`.
- `check-layout`: new hero-fit assertion at 1440 by 900 and 1920 by 1080; `CHROME_ARGS` env for `--no-sandbox`.
- Docs: ADR-005 and ADR-006, DESIGN-DEBT (live review blocks), STANDARDS 25 to 35, DRAFT-ADDITIONS (pane copy), CLAUDE.md rule 5, master prompt v1.3 (also copied to `workspace/templates/website-build/` and the Project doc).
- Ricardo's launch questions are a Google Doc in the RC client Drive folder (sent 2026-10-19).

**Verified on this build**
- `npm run check`: passes (same 8 copy-owner length notes as before).
- `npm run check:layout`: passes, 28 pages at 15 widths plus the hero-fit check. Run in the cloud container as `CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome CHROME_ARGS=--no-sandbox npm run check:layout`; on the Mac the default Chrome path works.
- Lighthouse not re-run this session.

**Still blocked** (unchanged from session 2, below): Vercel env vars and the real `LAUNCH` host, photo originals (hero still carries the baked-in RC mark), Ricardo's CONFIRM answers, legal approval.

**Round 2, same day: inner pages (ADR-006)**
- `src/lib/rhythm.ts` plans every copy-driven page: opening photo beside the first section (by job type, rotated by route), one dark band in the first half, CTA band below the FAQ when it would crowd the dark band. Wired into `[service].astro`, `TrustPage.astro`; city pages and the offer page set by hand (city services grid is the dark band with photo cards). `ContentSection` takes `photo` and `bg="contrast"`; one unlayered `.on-dark` rule inverts the fg utilities. `npm run audit:rhythm` prints the result per page. Both gates pass.
- Opening photos repeat across pages (five photos for 28 pages) and the commercial page falls back to a house photo. Photo originals remain the blocker.

**Round 5, same day: Ricardo's answers, placeholder-free site (ADR-007)**
- Every `[CONFIRM]` in `copy/batch-1..5.md` resolved from the launch-questions Google Doc and Sam's seven decisions (ADR-007). Eight title and description lengths fixed in the copy. Brava paragraph on roof replacement, Brava and CertainTeed SureStart PLUS 3-Star detail on About, Enhancify terms on Financing, ProVia, Velux, Leaf Relief, CertainTeed and Hardie siding lines, TPO and EPDM, standing seam, 60-day repair warranty, after-hours emergency line, no prices anywhere.
- Code: `PhotoGap` and empty `ReviewCard` render nothing, `Figure` drops unknown towns, city pages carry neighborhoods and a general RC project, external CTA hrefs, footer Facebook and Google review links, `business.json` filled.
- `npm run check:production`: 0 CONFIRM slots. Its one failure is the LIVE host switch, by design until cutover. `check:layout` passes.

**Still blocked, outside the repo**
- Vercel env: `LEAD_NOTIFY_TO=info@rcallexteriors.com`, `LEAD_NOTIFY_CC=rcroofingllc1@gmail.com`, `RESEND_API_KEY`, `COMMAND_CENTER_TOKEN`, `GOOGLE_PLACES_KEY`, `GBP_PLACE_ID` (the review sections are empty until these two are set), `PUBLIC_GA_ID`.
- Warranty PDF: Ricardo is sending it; check the workmanship-warranty sentences against it (10 years, one transfer, 60 days on repairs).
- Ricardo: four case studies and the town for each photo; Fairfax, Springfield and Lorton jobs to replace the general project.
- Cutover: `LAUNCH` to the real preview host and `LIVE` switch in `src/lib/site.ts`, `deploy/redirects.json` un-parked.

**Round 4, same day: Ricardo's photos (92 files, sorted on Sam's Mac at `~/Desktop/RC All Exteriors`, MANIFEST.csv there)**
- 25 originals into `src/assets/photos/` as `rc-*.jpg`, 2400px cap, registered in `src/data/photos.ts` with `pool: false` on people and process shots so they stay out of the opening-photo rotation. Hero is the unwatermarked colonial street view with a pre-cut 16:9 `heroSrc` (Gate A finding 9 closed). Slots filled: about hero, inspection page, roof replacement before-and-after, roof repair flashing, CertainTeed finished roof, process steps, homepage Why us and service cards, flat roof card. LCP photos rematched on commercial, storm, repair, gutters, siding, metal, inspection, Fairfax, Lorton.
- CONFIRM list regenerated: 116 distinct (was 121). 10 photo slots remain and no file covers them (estimate walkthrough, estimate on the table, inspection report page, metal roof, hail marks, window or door before-and-after, three city before-and-afters, the map which stays schematic by ADR-004).
- Build note: 30 photos at 3200px ran the 8GB container out of memory. Originals capped at 2400px; build with `SHARP_CONCURRENCY=1` (25 minutes cold, seconds warm). STANDARDS 37 and 38.
- Drive: Sam is uploading the sorted job folders himself (the connector cannot carry 310MB).

**Round 3, same day:** service icons in the services dropdown and the mobile services list, from the nav registry. Master prompt section 7.

**Next**
- Sam's next round of callouts on the live site, section by section.
- Push this commit from the Mac (the cloud session cannot push: the Claude GitHub App is not installed on `poweredbysurge`).


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
- **Photo originals.** Resolved 2026-10-19 for 25 photos (round 4 above). Ten photo slots still have no file; see CONFIRM-LIST.md.
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
