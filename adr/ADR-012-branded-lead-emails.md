# ADR-012: Branded lead emails, Resend first, Command Center later

**Date:** 2026-10-23
**Status:** Accepted. Promoted to MASTER-WEBSITE-PROMPT v1.4 the same day.

The site can launch on email notifications alone; the Command Center tenant follows (`docs/COMMAND-CENTER-RUNBOOK.md`). The lead handler already fans out to both and accepts a lead when either sink takes it, so this is configuration plus a redesign of the two messages.

## Decisions

1. **One frame, two messages** (`src/lib/email.ts`): dark header with the white lockup (PNG at `public/email/logo-white.png`, since mail clients do not render SVG), white card, muted footer with the business line. Colors read from `theme.generated.css` at build so the email follows the tokens. Table layout, inline styles, system sans, 600px, preheader text.
2. **Internal notification is built for the phone.** Name, reason chip, "OK to text" chip, one sentence, then Call (`tel:`), Text (`smsto:` with a prefilled first message, only when the homeowner consented) and Email (`mailto:` with a subject) as bulletproof buttons. Details table, then a separate "where it came from" table so attribution does not bury the lead. `reply_to` is the homeowner.
3. **Homeowner confirmation** names the number we will call, the hours, the three steps, and carries Call and Text buttons plus the rating line. `reply_to` is the business inbox.
4. **Sender.** `LEAD_NOTIFY_FROM` and `LEAD_REPLY_FROM` on Surge's verified `updates.thesurgeagency.com` until RC has its own sending domain (a per-tenant domain in Command Center, ADR-024 there). The handler reads `LEAD_NOTIFY_FROM` (was a literal).
5. **Env on Vercel** (Production and Preview): `LEAD_NOTIFY_TO=info@rcallexteriors.com`, `LEAD_NOTIFY_CC=rcroofingllc1@gmail.com,manager@thesurgeagency.com`, the two `*_FROM` values, and `RESEND_API_KEY` entered by Sam. `COMMAND_CENTER_*` stay unset until the tenant exists; forwarding is skipped, not failed.

## Not done

Previewed with a sample lead in the build, not sent: the first real send is the preview form test after the key lands. The logo in the email loads from the site, so it shows once this deploy is live.
