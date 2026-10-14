// Lead intake: validation, source attribution and fan-out (master prompt
// section 11, ADR-003). Field names are a contract with Surge Command Center.
import business from '@/data/business.json';
import { REASON_KEYS, REASONS, CONTACT_REASONS, ROOF_AGES, URGENCIES } from '@/data/lead-form';

export interface Lead {
  full_name: string;
  phone: string;
  email: string;
  zip: string;
  reason: string;
  consent_sms: boolean;
  consent_text_version: string;
  address_street?: string;
  address_city?: string;
  address_state?: string;
  roof_age?: string;
  urgency?: string;
  budget_band?: string;
  referral_source?: string;
  notes?: string;
  form_id: string;
  page_url: string;
  schema_version: string;
  lead_key: string;
  attribution: Record<string, string>;
  step: 1 | 2;
}

const ATTR_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'referrer', 'landing_page', 'gclid_captured_at'];
const str = (v: unknown, max = 300) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const oneOf = (v: string, keys: readonly string[]) => (keys.includes(v) ? v : undefined);

export function parseLead(body: Record<string, unknown>): { lead: Lead } | { error: string } {
  const phoneDigits = str(body.phone, 40).replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
  const lead: Lead = {
    full_name: str(body.full_name, 120),
    phone: phoneDigits,
    email: str(body.email, 200).toLowerCase(),
    zip: str(body.zip, 10),
    reason: str(body.reason, 40),
    consent_sms: body.consent_sms === true,
    consent_text_version: str(body.consent_text_version, 60),
    address_street: str(body.address_street, 200) || undefined,
    address_city: str(body.address_city, 80) || undefined,
    address_state: str(body.address_state, 2) || undefined,
    roof_age: oneOf(str(body.roof_age, 20), ROOF_AGES.map((o) => o.key)),
    urgency: oneOf(str(body.urgency, 20), URGENCIES.map((o) => o.key)),
    budget_band: str(body.budget_band, 40) || undefined,
    referral_source: str(body.referral_source, 80) || undefined,
    notes: str(body.notes, 2000) || undefined,
    form_id: str(body.form_id, 40) || 'form',
    page_url: str(body.page_url, 500),
    schema_version: str(body.schema_version, 10) || '1.0',
    lead_key: str(body.lead_key, 64),
    attribution: {},
    step: body.step === 2 || body.step === '2' ? 2 : 1,
  };
  const attr = (body.attribution ?? {}) as Record<string, unknown>;
  for (const key of ATTR_KEYS) {
    const value = str(attr[key]);
    if (value) lead.attribution[key] = value;
  }
  if (lead.full_name.length < 2) return { error: 'full_name' };
  if (lead.phone.length !== 10) return { error: 'phone' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) return { error: 'email' };
  if (!/^\d{5}$/.test(lead.zip)) return { error: 'zip' };
  if (!(REASON_KEYS as readonly string[]).includes(lead.reason)) return { error: 'reason' };
  if (!lead.lead_key) return { error: 'lead_key' };
  return { lead };
}

const SEARCH = ['google.', 'bing.', 'duckduckgo.', 'yahoo.', 'ecosia.', 'brave.', 'startpage.'];
function host(url: string | undefined): string {
  try {
    return new URL(url ?? '').hostname.toLowerCase();
  } catch {
    return '';
  }
}

/** Priority order from master prompt section 11. */
export function sourceDetail(a: Record<string, string>): string {
  const source = (a.utm_source ?? '').toLowerCase();
  const medium = (a.utm_medium ?? '').toLowerCase();
  const ref = host(a.referrer);
  if (a.gclid || a.gbraid || a.wbraid) return 'google_ads';
  if (source === 'lsa' || medium === 'lsa') return 'lsa';
  if (a.fbclid || /facebook|^ig$|instagram|meta/.test(source)) return 'facebook';
  if (source === 'gbp' || /maps\.google|google\.[a-z.]+\/maps/.test(a.referrer ?? '')) return 'gbp';
  if (SEARCH.some((h) => ref.includes(h))) return 'organic';
  if (ref) return 'referral';
  return 'direct';
}

const env = (name: string) => (typeof process !== 'undefined' ? process.env[name] : undefined) || (import.meta.env[name] as string | undefined);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const fmtPhone = (d: string) => `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
const label = (list: readonly { key: string; label: string }[], key?: string) => list.find((o) => o.key === key)?.label ?? key ?? '';

async function resend(payload: Record<string, unknown>): Promise<boolean> {
  const key = env('RESEND_API_KEY');
  if (!key) return false;
  const res = await fetch(env('RESEND_API_URL') || 'https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) console.error('[lead] Resend returned', res.status, await res.text().catch(() => ''));
  return res.ok;
}

const SENDER = `${business.name} Leads <leads@updates.thesurgeagency.com>`;

/** 1. Internal notification to the client and Surge. This one has to land. */
export async function notifyInternal(lead: Lead, source: string): Promise<boolean> {
  const to = (env('LEAD_NOTIFY_TO') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const cc = (env('LEAD_NOTIFY_CC') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!to.length) {
    console.error('[lead] LEAD_NOTIFY_TO is not set');
    return false;
  }
  const reason = label([...REASONS, ...CONTACT_REASONS], lead.reason);
  const rows: [string, string | undefined][] = [
    ['Name', lead.full_name],
    ['Phone', fmtPhone(lead.phone)],
    ['Email', lead.email],
    ['Zip', lead.zip],
    ['Reason', reason],
    ['Street address', lead.address_street],
    ['Roof age', label(ROOF_AGES, lead.roof_age)],
    ['How soon', label(URGENCIES, lead.urgency)],
    ['Notes', lead.notes],
    ['Text consent', lead.consent_sms ? `Yes (${lead.consent_text_version})` : 'No'],
    ['Source', source],
    ['Form', `${lead.form_id}, step ${lead.step}`],
    ['Page', lead.page_url],
    ['Landing page', lead.attribution.landing_page],
    ['Referrer', lead.attribution.referrer],
    ['Campaign', [lead.attribution.utm_source, lead.attribution.utm_medium, lead.attribution.utm_campaign].filter(Boolean).join(' / ')],
  ];
  const html = `<h2 style="font-family:sans-serif">${lead.step === 2 ? 'More details on a lead' : 'New website lead'}: ${esc(lead.full_name)}</h2>
<table style="font-family:sans-serif;font-size:15px;border-collapse:collapse">${rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#555;vertical-align:top">${k}</td><td style="padding:4px 0">${esc(v!).replace(/\n/g, '<br>')}</td></tr>`)
    .join('')}</table>
<p style="font-family:sans-serif;font-size:13px;color:#777">Lead key ${esc(lead.lead_key)}</p>`;
  return resend({
    from: SENDER,
    to,
    ...(cc.length ? { cc } : {}),
    reply_to: lead.email,
    subject: `${lead.step === 2 ? 'Lead details' : 'New lead'}: ${lead.full_name} (${reason}, ${lead.zip})`,
    html,
  });
}

/** 2. Confirmation to the lead. Only from a client-verified sending domain; skipped silently otherwise. */
export async function confirmToLead(lead: Lead): Promise<void> {
  const from = env('LEAD_REPLY_FROM');
  if (!from || lead.step !== 1) return;
  try {
    await resend({
      from,
      to: [lead.email],
      subject: `We got your request, ${lead.full_name.split(' ')[0]}`,
      html: `<p style="font-family:sans-serif;font-size:16px">Thanks for reaching out to ${business.name}. We have your request and will call you to set a time.</p><p style="font-family:sans-serif;font-size:16px">Need us sooner? Call or text ${business.phone.display}.</p>`,
    });
  } catch (err) {
    console.error('[lead] confirmation email failed:', (err as Error).message);
  }
}

/** 3. Forward to Surge Command Center. Best effort; returns whether the receiver took it. */
export async function forwardToCommandCenter(lead: Lead, source: string, meta: { ip: string; userAgent: string }): Promise<boolean> {
  const token = env('COMMAND_CENTER_TOKEN');
  if (!token) return false;
  const url = env('COMMAND_CENTER_URL') || 'https://command.thesurgeagency.com/api/inbound/lead-form';
  const { attribution, ...fields } = lead;
  const body = Object.fromEntries(
    Object.entries({
      ...fields,
      attribution,
      ...attribution,
      address_zip: lead.zip,
      lead_source: 'website',
      source_detail: source,
      external_id: `${lead.lead_key}:${lead.form_id}:${lead.step}`,
      // Stamped here, never taken from the browser: this is the SMS consent evidence.
      ip_address: meta.ip,
      user_agent: meta.userAgent,
    }).filter(([, v]) => v !== undefined && v !== ''),
  );
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-tenant-token': token },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) console.error('[lead] Command Center returned', res.status);
    return res.ok;
  } catch (err) {
    console.error('[lead] Command Center forward failed:', (err as Error).message);
    return false;
  }
}
