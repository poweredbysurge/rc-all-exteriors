# Gate A review: RC All Exteriors Mode A export
**Reviewed:** 2026-10-07 by Claude (independent of the design session) · **Package:** `design/` dated 2026-10-08, 27 artboards, 43 files, 9.1 MB
**Verdict:** APPROVE for Mode B, with the fixes below carried into code (none require another design pass).

## What was checked, independently of the package's own checklist

| Check | Method | Result |
|---|---|---|
| Em dashes in any file | grep across all 43 files | 0 |
| Type floor | every `font-size` value in all pages | smallest is 16px, 1,750 instances; body 18px, 404 instances. Pass |
| Font families | every `font-family` value | Archivo, Manrope, ui-monospace (annotations only). Pass |
| Palette | every hex in pages and tokens.css | 23 values, all from the token set plus error red. One `#00a2fd` string, which is the tokens page saying "no #00A2FD anywhere". Pass |
| Links | every `href` in 27 pages vs LINK-MAP.json | 685 internal hrefs, 0 `#`, 0 unmapped. 32 distinct destinations, all real sitemap routes plus tel, mailto, Instagram, Surge. Pass |
| Assets | every referenced asset vs assets/ | 5 images, 3 logos, all referenced, nothing unused. Pass |
| CONFIRM slots | `data-confirm` count | 15 on home, 10 each on roof-replacement, fairfax, components. All findable with one search. Pass |
| Copy verbatim | first 8 words of every [H1] [H2] [H3] [SUBHEAD] [P] [FAQ A] in batch-1 §2, §3, §6 and batch-5 §1 against page text | Every heading and paragraph present. Only misses are FAQ answers, which are collapsed (see finding 1) or carry an inline CONFIRM token. Pass |
| Overflow | Playwright at 360, 390, 1440, 1920 | scrollWidth equals viewport plus the 448px annotation gutter on every artboard. No content overflow. Pass |
| Visual review | home-1440, home-390, roof-replacement-1440, fairfax-390, free-roof-inspection-390, tokens, components rendered and read | See findings |

## Findings (carry into Mode B; none block approval)

1. **Collapsed FAQ answers are not in the export HTML.** Only the open answer per accordion is present. The answers exist in the copy batches, so Mode B builds FAQs from the copy, not from the export, and emits FAQPage schema from the same source. No design change.
2. **Mobile hero is about 2,000px tall** (H1, lede, two buttons, five trust items, full lead card with consent text). On a phone the form starts two screens down. Mode B: trust row on mobile shows two items (Google rating, Class A); the other three already live in the stat strip below. Keep the full card; the sticky bottom CTA covers the scroll.
3. **Hero lede contrast at the top of the mobile scrim.** The scrim is 45% at the top and the lede sits in it over sky and trees on the inspection page. tokens.css already notes this. Mode B: scrim 60% from 0 to 40% on mobile, or push the lede below the 40% line. Verify at 390 on the inspection and roof-replacement heroes.
4. **"10-year" breaks across lines** in the H1 at 1440 and 390 and in the stat strip ("10-\nyear", "Class\nA"). Mode B: non-breaking hyphen (U+2011) in "10‑year" and `white-space: nowrap` on stat strip values.
5. **Step numerals (01 to 04) behind the process titles** read as a smudge at 10% opacity under a wrapped heading. Mode B: 6% opacity, positioned top-left of the card, and the title gets `padding-top` so they do not overlap. Or drop the numeral; the photo and title carry the step.
6. **Footer link rows are about 34px** (16px type on 12px gaps). Mode B: 44px row height per master prompt section 17. Already noted in the package checklist.
7. **Service area map is schematic** (dots by lat/lon, no county outline). Fine for review. Mode B: static map tile centered on 22192 with the same dot overlay, or keep the schematic if the tile looks generic. Decide at build.
8. **tear-off.jpg is an underlayment shot.** Caption already says "in progress, underlayment". Mode B: rename the asset `underlayment.jpg` so the filename stops lying.
9. **Hero photo has the RC mark baked in** (GBP cover). Mode B uses the unwatermarked source from Drive, `colonial-home-roof-replacement-gray-shingle-01.jpg`, confirm visually.

10. **Mobile section padding was 48px and read as dense.** Fixed in the export on 2026-10-07 by Sam's call: every content section on the 360 and 390 artboards is now `padding:100px 20px` (42 sections across 6 artboards), desktop raised from 96px to 128px (33 sections) so mobile is never tighter than desktop, `tokens.css` updated (`--section-py-mobile: 100px`, `--section-py-desktop: 128px`). Promoted to MASTER-WEBSITE-PROMPT v1.2 sections 3 and 5 so every future build starts there. Mode B uses the tokens, not the old 48px.

## Decisions for Sam (the package's four open items), with a recommendation

| Item | Options | Recommendation |
|---|---|---|
| Header nav | A: Services · Service Areas · Warranty · Financing · Reviews · About (batch-1 spec, drawn). B: Services · Service Areas · Reviews · About · Contact (Mode A prompt) | **A.** Warranty and Financing are the trust pages the copy is built around; Contact is the CTA button and the footer. Keep as drawn. |
| Connective sentence on the service hub city row ("Based in Woodbridge. Serving Lake Ridge and the neighborhoods around our home base, plus:") | keep / cut | **Keep.** It is one line, plain, and true. Log it as DRAFT in the copy doc so it gets the humanizer pass. |
| "We confirm a time" timeline row on the inspection page | keep / cut | **Keep.** Built from the copy's own confirmation sentence; it makes the timeline four honest steps. |
| Six section eyebrows (Why us, Services, Reviews, Service area, What is included, Recent work) | keep / cut | **Keep.** They are the copy doc's own section labels, 16px, and they carry the roofline rule, which is the brand's one graphic. |

## What is strong

The tokens page is the best one we have shipped: every token, every contrast pair computed, the four ADR-002 slots resolved and printed, the icon list named. The link map is complete and the `data-confirm` and `data-action` conventions mean the port can find every placeholder and every interaction with one search each. Copy is verbatim. One accent held everywhere. The mobile pages read cleanly at 18px.

## Gate A

Sam records approval in `design/GATE-A.md` with the date and the export date (2026-10-08). After that, `design/pages/` is read-only; deviations in code go in `DESIGN-DEBT.md` in the repo.
