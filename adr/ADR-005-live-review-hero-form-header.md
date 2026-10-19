# ADR-005: Contained hero, paned lead card, dark header, homepage order

**Date:** 2026-10-19
**Status:** Accepted. Promoted to MASTER-WEBSITE-PROMPT v1.3 the same day.

Sam reviewed the published preview against the old rcallexteriors.com homepage. Three things the old site did better: dark surfaces bracketing the page (header, bands, footer), a readable logo, and the services shown inside one scroll. Two things wrong with ours: the hero overran the first viewport, and the lead card was long. Each fix below is a template rule now, not a client fix, because every future build would have hit the same five.

## 1. The hero is contained to the first viewport

The hero grid had `min-height: 640px` inside a section with 128px padding top and bottom, and the card showed every step 1 field at once (about 900px). At 1440 by 900 the hero ran to roughly 1,150px and the trust row fell off the screen.

**Decision:** on desktop the hero section is `min-height: clamp(--hero-min, 100svh - header, --hero-max)` with 40px padding, content centered. 640 to 820px. `check-layout` now fails any photo-hero page whose hero bottom or lead card bottom is below the viewport at 1440 by 900 or 1920 by 1080. The homepage display H1 is one step under the display token (max 60px) so the 10-word headline holds three lines. The trust row left the hero for its own light strip directly under it (`TrustStrip.astro`): chip plus three items on desktop, chip plus two on phones. The fourth copy item (the warranty) is in the H1 and the stat strip already.

## 2. The lead card is quiz panes on the same contract

Step 1 was one tall form. The card is now two panes: pane 1 is "What's going on?" as full-width option rows (native radios styled as rows, a tap advances), pane 2 is name, zip, phone, email, consent, and its submit is the step 1 POST. Nothing is sent before it, the 3-second floor runs from first render, the honeypot and the retry queue are unchanged, and `generate_lead` still fires on the step 1 2xx. Step 2 is one question per pane with Next until the last, then Finish; Skip posts nothing, as on HomeSource.

This is the HomeSource `/lp/` ladder (`initQuizPanes` in `hs-forms.js`) with Sunrise's one-tap first question (`InquiryForm.tsx`). Field names and the `/api/lead/` payload did not change, so Command Center sees the same lead. Without JS every pane is visible and the form posts as one.

Step 1 is now about 560 to 600px tall on either pane, which is what makes item 1 possible.

## 3. Dark header, bigger logo

The RC lockup is wide and low. At 40px in an 80px white header the wordmark was unreadable, and the page had one dark surface (the hero) between a white header and a white strip. **Decision:** header on `surface-contrast` with the white lockup at 56px (44px on phones, 44px shrunk), 88px tall (72 on phones), header CTA as the inverse button because the accent button vanishes on navy. The mobile panel is dark too. Master prompt section 7 said "not below 32px", which allowed the unreadable state; it now says 44px.

## 4. Homepage order and surfaces

Services moved from fourth to second, image-led (one real job photo per card at 16:10, no icon), on the page's first dark band. The problem opener follows as the page's one text-only two-column section, then Why us with its photo and the stat strip. Financing became the second dark band and carries a photo. Surface sequence is now dark, dark, light strip, dark, light, tint, light, tint, dark, light, tint, dark, dark. Rules in master prompt section 5: no more than three consecutive light bands, one dark band per half of the homepage, every section but the FAQ carries a visual.

## 5. Where post-Gate-A tokens live

`design/` is read-only. New and changed tokens (header heights, logo sizes, hero min and max, quiz bar) are in `brand/tokens.overrides.css`, which `scripts/sync-tokens.mjs` reads after `design/tokens.css`. Each entry names this ADR. Logged in `DESIGN-DEBT.md` so the next Mode A export starts from these values.

## What did not change

The copy (every sentence still comes from `copy/batch-*.md`; the pane titles and the "About 30 seconds, no obligation" line are DRAFT in `copy/DRAFT-ADDITIONS.md`), the lead contract, the 100px / 128px section rhythm, the type scale below the display size, and the Gate A artboards themselves.
