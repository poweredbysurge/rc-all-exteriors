# ADR-014: DNS cutover, LIVE host, legacy redirects

**Date:** 2026-10-24
**Status:** Accepted.

Sam pointed rcallexteriors.com at Vercel at about 1:20 PM PT. This commit is the site side of the cutover (master prompt section 21 launch protocol).

1. `SITE` is `LIVE` (`https://rcallexteriors.com`): canonicals, `og:url`, `og:image`, JSON-LD URLs and the sitemap now name the real domain. `check:production` passes clean for the first time.
2. The five 301s from the old WordPress site (`deploy/redirects.json`, `doNotDeployYet: false`) are on-demand routes under `src/pages` (`gutters-siding.ts`, `home.ts`, `roof-siding-repairs.ts`, `author/[...path].ts`, `metform-form/[...path].ts`) answering from `src/lib/legacy.ts`. Not Astro `redirects` config: it refuses a wildcard source to a static destination, and it emits exact sources without the trailing slash the old links carry, so `/gutters-siding/` would have fallen through to the 404.
3. Apex is canonical. Vercel was added with `www` as primary and the apex redirecting to it; the old site, its sitemap and the Google profile all use the apex, so the Vercel redirect direction is flipped to www → apex at cutover (Sam's call, done from the project domains).

Left for the same day: `PUBLIC_GA_ID`, Search Console verification and sitemap submission, one form test on the real domain, the Facebook Sharing Debugger refresh.
