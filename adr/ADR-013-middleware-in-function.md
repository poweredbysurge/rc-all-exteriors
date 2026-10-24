# ADR-013: Middleware runs in the render function, not at the edge

**Date:** 2026-10-23
**Status:** Accepted. Promoted to MASTER-WEBSITE-PROMPT v1.4 the same day. Amends ADR-001.

## What broke

Every POST to `/api/lead/` on Vercel failed with `FUNCTION_INVOCATION_FAILED` and this in the function log:

> TypeError: A request with a one-time-use body (it was initialized from a stream, not a buffer) encountered a redirect requiring the body to be retransmitted.

With `middlewareMode: 'edge'` the adapter routes every on-demand request (`/api/lead/`, `/api/reviews/`, `robots.txt`) to the edge middleware first, which forwards to the render function over an internal fetch. That hop hits the adapter's own trailing-slash 308 (`trailingSlash: 'always'`), and a streamed POST body cannot be replayed through a redirect. GET requests mostly survived; the form never did. Local preview has no edge hop, so the gate, the headless form walk and the layout checks all passed.

## Decision

`adapter: vercel()` with no edge mode. `src/middleware.ts` runs inside the render function. Routes now go `^/api/lead/$ → _render`.

What changes: the `X-Robots-Tag: noindex` header on the preview host is only on on-demand responses (robots.txt, the API), not on static pages, because static pages are served from the CDN without running middleware. `robots.txt` on a non-production host already answers `Disallow: /`, which is the first layer and the one crawlers honor, so the preview stays out of the index.

## Lesson for the template

An API route is not verified until a POST has been made against the deployed host and the response read. Add it to the launch protocol: before the client review, submit the form on the preview deployment and confirm the 2xx, the email and the receiver row. Host-level routing (redirects, trailing slashes, edge hops) does not exist in the local preview.
