// First-touch attribution and the lead retry queue. Shared by site.ts (runs on
// every page) and lead.ts (runs where a form is).

const ATTR_COOKIE = 'rc_attr';
const ATTR_DAYS = 90;
const QUEUE_KEY = 'rc_lead_queue';
const LEAD_KEY = 'rc_lead_key';
export const LEAD_ENDPOINT = '/api/lead/';

export type Attribution = Partial<
  Record<
    | 'gclid'
    | 'gbraid'
    | 'wbraid'
    | 'fbclid'
    | 'utm_source'
    | 'utm_medium'
    | 'utm_campaign'
    | 'utm_term'
    | 'utm_content'
    | 'referrer'
    | 'landing_page'
    | 'gclid_captured_at',
    string
  >
>;

function readCookie(name: string): string | null {
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(readCookie(ATTR_COOKIE) ?? '{}') as Attribution;
  } catch {
    return {};
  }
}

/** First touch wins: the cookie is written once and kept for 90 days. */
export function captureAttribution(): void {
  try {
    if (readCookie(ATTR_COOKIE)) return;
    const params = new URLSearchParams(location.search);
    const attr: Attribution = {};
    for (const key of ['gclid', 'gbraid', 'wbraid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const) {
      const value = params.get(key);
      if (value) attr[key] = value.slice(0, 200);
    }
    if (attr.gclid) attr.gclid_captured_at = new Date().toISOString();
    // Same-site navigation is not a referrer.
    if (document.referrer && !document.referrer.startsWith(location.origin)) attr.referrer = document.referrer.slice(0, 300);
    attr.landing_page = (location.pathname + location.search).slice(0, 300);
    const secure = location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${ATTR_COOKIE}=${encodeURIComponent(JSON.stringify(attr))}; Max-Age=${ATTR_DAYS * 86400}; Path=/; SameSite=Lax${secure}`;
  } catch {
    // Attribution is never allowed to break the page.
  }
}

/** One key per browser session, shared by both steps so the receiver can join them. */
export function leadKey(): string {
  try {
    let key = sessionStorage.getItem(LEAD_KEY);
    if (!key) {
      key = crypto.randomUUID();
      sessionStorage.setItem(LEAD_KEY, key);
    }
    return key;
  } catch {
    return crypto.randomUUID();
  }
}

type Payload = Record<string, unknown>;
const sameSubmission = (a: Payload, b: Payload) =>
  a.lead_key === b.lead_key && a.form_id === b.form_id && a.step === b.step;

function readQueue(): Payload[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]') as Payload[];
  } catch {
    return [];
  }
}
function writeQueue(queue: Payload[]): void {
  try {
    if (queue.length) localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-5)));
    else localStorage.removeItem(QUEUE_KEY);
  } catch {
    // Storage can be unavailable (private mode). The inline retry copy still shows the phone number.
  }
}
export function enqueue(payload: Payload): void {
  writeQueue([...readQueue().filter((p) => !sameSubmission(p, payload)), payload]);
}
export function dequeue(payload: Payload): void {
  writeQueue(readQueue().filter((p) => !sameSubmission(p, payload)));
}

export interface LeadResponse {
  ok: boolean;
  lead_key?: string;
  source_detail?: string;
}

export async function postLead(payload: Payload): Promise<LeadResponse> {
  const res = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  });
  if (!res.ok) throw new Error(`lead endpoint returned ${res.status}`);
  return (await res.json()) as LeadResponse;
}

/** GA4 events carry closed-enum params only. No PII, ever. A failure here never reaches the visitor. */
export function track(event: 'generate_lead' | 'lead_qualified', params: Record<string, string | undefined>): void {
  try {
    const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
    if (typeof gtag !== 'function') return;
    const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => !!v));
    gtag('event', event, clean);
  } catch {
    // swallowed on purpose
  }
}

/** Replays submissions whose POST failed on an earlier page view. */
export async function retryQueue(): Promise<void> {
  for (const payload of readQueue()) {
    try {
      const res = await postLead(payload);
      dequeue(payload);
      if (res.ok && payload.step === 1) {
        track('generate_lead', { reason: String(payload.reason ?? ''), source_detail: res.source_detail });
      }
    } catch {
      // Still offline or the endpoint is still down. Leave it queued for next time.
    }
  }
}
