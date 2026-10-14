// POST /api/lead/ (same origin). Validates, attributes and fans out:
//   1. internal notification through Resend (must land, or the request fails)
//   2. confirmation to the lead (only with a client-verified sender)
//   3. Surge Command Center (best effort, never blocks the lead)
//
// A lead is never dropped behind a success message. If neither the email nor
// the Command Center accepted it, the response is 503 and the form shows the
// retry copy with the phone number, and queues the payload for replay.
// Bots (honeypot, sub-3-second submit, rate limit) get a quiet 200.
import type { APIRoute } from 'astro';
import { confirmToLead, forwardToCommandCenter, notifyInternal, parseLead, sourceDetail } from '@/lib/lead';

export const prerender = false;

const RATE_LIMIT = 8;
const WINDOW_MS = 60_000;
// Per-instance only: stops one misbehaving client, not a distributed attack.
const buckets = new Map<string, { count: number; resetAt: number }>();
function limited(ip: string): boolean {
  const now = Date.now();
  const entry = buckets.get(ip);
  if (!entry || now > entry.resetAt) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export const POST: APIRoute = async ({ request }) => {
  // Same-origin only.
  const origin = request.headers.get('origin');
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (origin && host && new URL(origin).host !== host) return json({ ok: false }, 403);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return json({ ok: false }, 400);
  }

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  const userAgent = request.headers.get('user-agent') ?? '';
  const step = body.step === 2 || body.step === '2' ? 2 : 1;

  // Quiet success for bots: never an error they can learn from.
  const honeypot = typeof body.company_website === 'string' && body.company_website.trim() !== '';
  const tooFast = step === 1 && typeof body.elapsed_ms === 'number' && body.elapsed_ms < 3000;
  if (honeypot || tooFast || limited(ip)) return json({ ok: true });

  const parsed = parseLead(body);
  if ('error' in parsed) return json({ ok: false, field: parsed.error }, 422);
  const { lead } = parsed;
  const source = sourceDetail(lead.attribution);

  const configured = !!(process.env.RESEND_API_KEY || process.env.COMMAND_CENTER_TOKEN);
  if (!configured && import.meta.env.DEV) {
    // Local development with no credentials: show the lead, accept it.
    console.log('[lead] dev mode, nothing configured. Lead:', JSON.stringify({ ...lead, source_detail: source }, null, 2));
    return json({ ok: true, lead_key: lead.lead_key, source_detail: source, dev: true });
  }

  const [emailed, forwarded] = await Promise.all([
    notifyInternal(lead, source).catch((err) => {
      console.error('[lead] notification failed:', (err as Error).message);
      return false;
    }),
    forwardToCommandCenter(lead, source, { ip, userAgent }),
  ]);

  // Step 2 only adds detail to a lead that is already captured.
  if (!emailed && !forwarded && lead.step === 1) {
    console.error('[lead] NOT DELIVERED, no sink accepted lead', lead.lead_key);
    return json({ ok: false }, 503);
  }
  if (lead.step === 1) await confirmToLead(lead);
  return json({ ok: true, lead_key: lead.lead_key, source_detail: source });
};

export const ALL: APIRoute = () => json({ error: 'Method not allowed' }, 405);
