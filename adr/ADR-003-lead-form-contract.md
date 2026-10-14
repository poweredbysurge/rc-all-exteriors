# ADR-003: Lead form fields and the Command Center contract

**Date:** 2026-10-07
**Status:** Accepted (the merge proposed in `copy/SITEMAP.md`, confirmed in the Mode B input block)

## Decision

Two-step lead card per master prompt section 10, with the copy's own labels.

- **Step 1:** Full name, Phone, Email, Zip code, "What's going on?" (Leak / Storm damage / Roof is getting old / Buying or selling a home / Other), SMS consent (unchecked), honeypot. Button: "Book a Free Roof Inspection".
- **Step 2 (optional):** Street address, Roof age, How soon, Best time to reach you. "Finish" and "Skip".
- **Contact page:** one step. Adds Street address and Message; "What do you need?" uses the contact copy's six labels. Button: "Send My Request".

## Keys (do not rename)

| Field | Keys |
|---|---|
| `reason` (lead card) | `leaking`, `storm_damage`, `old_roof`, `buying_selling`, `something_else` |
| `reason` (contact) | Roof replacement `old_roof`, Roof repair or leak `repair`, Storm damage `storm_damage`, Gutters or siding `other_trades`, Windows or doors `other_trades`, Other `something_else` |
| `roof_age` | `under_10`, `10_20`, `over_20`, `not_sure` |
| `urgency` | `right_away`, `within_month`, `1_3_months`, `planning` |

Payload: `full_name, phone, email, zip, reason, consent_sms, consent_text_version, address_street, roof_age, urgency, notes, form_id, page_url, schema_version, lead_key, attribution, step`.

## Choices worth knowing

- **"Best time to reach you" has no contract field.** It travels in `notes` as "Best time to reach: Morning". The same goes for the contact page's chosen label, because two labels share `other_trades`.
- **Step 2 is a second POST** with the same `lead_key`, `step: 2`. The Command Center receiver dedupes on `lead_key:form_id:step`, so the two steps arrive as distinct events for one contact.
- **`form_id`** is `hero` on service, city and home pages, `inspection` on the offer page, `contact` on the contact page.
- **The server stamps** `ip_address`, `user_agent`, `source_detail`, `lead_source: website` and `external_id`. The browser never supplies them.
- **Consent text** is one string in `src/lib/site.ts` with a version (`sms-consent-2026-10-v1`). The label is rendered from that string, so text and version cannot drift.
- **A lead is never dropped behind a success message.** If neither Resend nor the Command Center accepts a step 1 lead, the route returns 503, the form shows retry copy with the phone number, and the payload is queued in localStorage for replay on the next page view.
- **Bots** (honeypot filled, submit inside 3 seconds, more than 8 posts a minute from one IP) get a quiet success and nothing is sent.

## Env vars

`RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_CC`, `COMMAND_CENTER_TOKEN`, `COMMAND_CENTER_URL` (defaults to the production receiver), `LEAD_REPLY_FROM` (only once RC has a verified sending domain; the confirmation email is skipped without it), `GOOGLE_PLACES_KEY`, `GBP_PLACE_ID`, `PUBLIC_GA_ID`.
