# Runbook: wire RC All Exteriors leads into Command Center

Written 2026-10-23 for the next session. The site side is done and waiting on
five environment variables; the Command Center side is a tenant that does not
exist yet. Nothing below touches another tenant's data.

## What the site already does

`/api/lead/` (`src/pages/api/lead.ts`, `src/lib/lead.ts`) takes the lead card's
two-step POST and, in parallel:

1. Emails the lead to `LEAD_NOTIFY_TO` (cc `LEAD_NOTIFY_CC`) through Resend from
   `LEAD_NOTIFY_FROM`, and a confirmation to the homeowner from `LEAD_REPLY_FROM`.
2. Forwards the lead to `COMMAND_CENTER_URL` (default
   `https://command.thesurgeagency.com/api/inbound/lead-form`) with the tenant's
   ingest token in `x-tenant-token`. Payload: the contract fields plus
   attribution, `lead_source: website`, `source_detail`, `external_id`
   (`lead_key:form_id:step`), and the server-stamped `ip_address` and
   `user_agent` as SMS consent evidence. Retry queue in the browser, 8s timeout.

Without `RESEND_API_KEY` or `COMMAND_CENTER_TOKEN` the production handler
returns an error, so the form is not live until step 3 below.

## Steps

### 1. Command Center tenant (repo `surge-command-center`, Supabase)

- Insert the tenant: `tenants` row with `slug: rc-all-exteriors`,
  `legal_name: RC All Exteriors LLC`, vertical `roofing`, brand JSON from
  `src/data/business.json` (name, phone, colors `#0F2ACE` accent, `#0A1030`
  dark; logo files in `public/logos/`). Use the same path the HomeSource
  tenant was created with (ADR-002, ADR-020 seed mechanism): the vertical
  template seeds sources, stages and custom fields.
- Read back the tenant's ingest token (ADR-025) for `COMMAND_CENTER_TOKEN`.
- Users, by magic link (no Supabase invite email):
  `node --env-file=.env.local scripts/provision-tenant-users.mjs rc-all-exteriors "rcroofingllc1@gmail.com:Ricardo Castro:owner" "manager@thesurgeagency.com:Sam Delgado:admin" --apply`
  Confirm Ricardo's login email with him first; `info@rcallexteriors.com` is the
  lead inbox and may be the better owner address.
- Sender domain for tenant email (ADR-024): not needed for the website's own
  notifications, which send from Surge's `updates.thesurgeagency.com`.

### 2. Resend

`RESEND_API_KEY` is Surge's key; the from address
`RC All Exteriors Website <leads@updates.thesurgeagency.com>` is already in
`.env.example` and on a verified Surge domain. If RC wants replies to come from
their own domain later, that is a per-tenant sender domain in Command Center.

### 3. Vercel (project `rc-all-exteriors`, Production and Preview)

| Variable | Value |
| --- | --- |
| `RESEND_API_KEY` | Surge Resend key |
| `LEAD_NOTIFY_FROM` | `RC All Exteriors Website <leads@updates.thesurgeagency.com>` |
| `LEAD_NOTIFY_TO` | `info@rcallexteriors.com` |
| `LEAD_NOTIFY_CC` | `rcroofingllc1@gmail.com,manager@thesurgeagency.com` |
| `LEAD_REPLY_FROM` | `RC All Exteriors <leads@updates.thesurgeagency.com>` |
| `COMMAND_CENTER_URL` | `https://command.thesurgeagency.com/api/inbound/lead-form` |
| `COMMAND_CENTER_TOKEN` | the tenant's ingest token from step 1 |

Already set: `GOOGLE_PLACES_KEY`, `GBP_PLACE_ID`. Still open: `PUBLIC_GA_ID`.

Redeploy after saving (env changes do not rebuild on their own).

### 4. Verify, end to end

1. On the preview, submit the lead card with a real phone you can read:
   step 1 (reason, name, zip, phone, email, consent), then step 2 answers, then
   Finish. Also test Skip on step 2 (posts nothing).
2. Resend dashboard: two sends (internal notification, homeowner confirmation).
3. Command Center: the lead appears under the RC tenant with `lead_source:
   website`, the `source_detail` of the form, and consent evidence (IP, UA,
   timestamp). The step 2 POST updates the same lead (`external_id`), not a
   second one.
4. `webhook_logs` shows the two inbound rows processed, no errors.
5. Speed to lead (ADR-013): confirm whatever the roofing template does on a
   new website lead (SMS to Ricardo, email) actually fires for RC.

### 5. Then

- Twilio number for RC if the template expects one (ADR-008, ADR-023): a
  sub-account and messaging service per tenant; A2P registration takes weeks,
  so file early.
- GBP integration (ADR-031) once Ricardo grants manager access from his own
  Google account.
- Cutover: `LIVE` switch in `src/lib/site.ts`, `deploy/redirects.json` un-parked.
