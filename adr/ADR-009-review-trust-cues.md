# ADR-009: Review cards as Google reviews

**Date:** 2026-10-23
**Status:** Accepted. Promoted to MASTER-WEBSITE-PROMPT v1.4 the same day.

The Places key went live and the first real review wall showed four things worth fixing before any other site ships one: a 170-word review stretched every card in its row, the stars were brand blue, nothing linked to the review on Google, and the cards had no face. For a home services site the review wall is the trust page; it has to read as Google, not as our rendering of Google.

## Decisions

1. **Google's yellow stars.** `--color-star: #FBBC04` in `brand/tokens.overrides.css`, used by `Stars.astro` everywhere (cards, pullquote, rating chip on both surfaces). The brand accent stays for everything else.
2. **Reviewer photo.** `authorAttribution.photoUri` from Places API (New), fetched at build through `getImage` (`image.domains: ['lh3.googleusercontent.com']`) and emitted as a local 72px WebP in a 36px circle, `alt=""`, lazy. Without one, or when the fetch fails, the first initial on the accent circle. No external asset request on the live page, which `check-integrity` forbids.
3. **Link to the real review.** `googleMapsUri` per review; the card's "View on Google" and the pullquote's "Google · date" open it in a new tab. The whole card is not a link, so the text stays selectable and the toggle works.
4. **Read more.** Over 320 characters the text is clamped to eight lines (`-webkit-line-clamp`) once the head script confirms JS, with a "Read more" / "Show less" toggle (`data-review-toggle` in `site.ts`). Without JS the full review shows. The grid stays even and the long review is still there, verbatim, one tap away.
5. **The count is never a literal.** `render.ts` replaces any number the copy puts before "five-star", "Google" or "reviews" with the live count (was: only the number that matched `fallbackCount`, which broke the moment the fallback was updated). `business.json` fallback moved from 49 (September) to 53 (October).

6. **Pullquote picks short.** `pickReviews(..., { pullquote: 0 })` gives the homepage pullquote the best review under 50 words (theme match first, then shortest); long reviews fall to the cards. A pullquote that is still long drops to H4 and clamps to six lines. Sam's note on the first live build: the 170-word review at H3 was "massive and overwhelming".
7. **Gate changes.** The no-exclamation check strips `[data-review-text]` first (customers may shout). `REVIEWS_MOCK=path.json` builds from a saved Places response so the wall can be checked without a key.

## Not done

Review text is still verbatim and untrimmed (master prompt section 12 says 40 to 60 words with an ellipsis; the clamp replaces that rule, since an ellipsis in the middle of a customer's sentence reads as editing). Places returns five reviews; the wall links to the profile for the rest.
