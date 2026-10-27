# ADR-020: Vercel BotID in front of the lead endpoint

**Date:** 2026-10-26
**Status:** Accepted. Shipped in `25b6da3`; this record was written the same day in a separate commit (Mario's call), because the implementation prompt limited that commit to the code files.

## Context

`POST /api/lead/` already had a same-origin check, a honeypot, a sub-3-second check and a per-instance rate limit. Those stop simple scripts, not a headless browser. Sunrise shipped Vercel BotID on its lead endpoint (`sunrise-landscape` commit `8809555`) and it held up. Deep Analysis is enabled on the `rc-all-exteriors` Vercel project (Firewall, Rules, BotID).

## Decision

1. **Client:** `src/scripts/botid.ts` calls `initBotId({ protect: [{ path: '/api/lead/', method: 'POST' }] })`, imported in `Base.astro` before `site`, on every page, because queued leads replay from localStorage on later page loads. The path matches the fetch URL exactly, trailing slash included.
2. **Server:** `checkBotId()` runs after the same-origin check and before the honeypot, timing and rate-limit checks, with the request headers passed explicitly (outside Next.js it cannot read them on its own). The check level is the dashboard setting; none is set in code.
3. **A flagged request gets a 403**, not the quiet 200 the other bot checks return, so a real person wrongly flagged sees the retry copy with the phone number. The quiet 200s are unchanged.
4. **Fail open:** if the BotID check throws, the lead is delivered and `[lead] BotID check errored` is logged. An outage must never cost RC a lead.
5. No rewrites in `vercel.json` or the Astro config. `/api/reviews/` (a GET) is not protected.

## Consequences

- A bare `curl -X POST` to the live endpoint returns 403 and logs `[lead] blocked by BotID`.
- Every page loads the BotID client; total client JS stays about 18 KB, well under the 60 KB budget.
- Rollback: `git revert 25b6da3`, or set BotID back to Basic in the dashboard.
