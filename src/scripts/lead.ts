// Lead card behavior (master prompt section 10).
//
//  - validation on blur and on submit, inline errors, first invalid field focused
//  - honeypot filled, or a submit inside 3 seconds: fake success, nothing sent
//  - POST /api/lead/; on 2xx the card moves to step 2 and GA4 generate_lead fires
//  - on failure the payload is queued in localStorage and replayed on the next
//    page view, and the visitor sees retry copy with the phone number
//  - step 2 is optional and can never lose the lead captured in step 1
import { dequeue, enqueue, getAttribution, leadKey, postLead, track } from './attribution';

const MIN_MS = 3000;
const SCHEMA_VERSION = '1.0';

type Values = Record<string, string | boolean>;

const validators: Record<string, (value: string) => string | null> = {
  full_name: (v) => (v.trim().length >= 2 ? null : 'Enter your name so we know who to ask for.'),
  phone: (v) => {
    const digits = v.replace(/\D/g, '').replace(/^1(?=\d{10}$)/, '');
    return digits.length === 10 ? null : 'Enter a 10-digit phone number so we can call you back.';
  },
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? null : 'Enter an email address, like name@example.com.'),
  zip: (v) => (/^\d{5}$/.test(v.trim()) ? null : 'Enter a 5-digit zip code.'),
  reason: (v) => (v ? null : 'Choose the option that fits best.'),
};
const labels: Record<string, string> = {
  full_name: 'name',
  phone: 'phone',
  email: 'email',
  zip: 'zip code',
  reason: 'reason',
};

function setError(field: HTMLInputElement | HTMLSelectElement, message: string | null): void {
  const errorId = `${field.id}-error`;
  let el = document.getElementById(errorId);
  if (!message) {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('p');
    el.id = errorId;
    el.className = 'field-error';
    el.setAttribute('data-sm', '');
    (field.closest('.relative') ?? field).after(el);
  }
  el.textContent = message;
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', errorId);
}

function validateField(field: HTMLInputElement | HTMLSelectElement): boolean {
  const check = validators[field.name];
  if (!check) return true;
  const message = check(field.value);
  setError(field, message);
  return !message;
}

function setBusy(button: HTMLButtonElement, busy: boolean): void {
  const label = button.querySelector<HTMLElement>('[data-label]');
  if (!label) return;
  if (busy) {
    button.dataset.idleLabel = label.textContent ?? '';
    button.setAttribute('aria-busy', 'true');
    button.disabled = true;
    label.innerHTML =
      '<svg class="spinner inline-block align-[-4px] mr-2" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M12 3a9 9 0 0 1 9 9" /><path d="M12 21a9 9 0 0 1-9-9" opacity="0.5" /></svg>Sending...';
  } else {
    button.removeAttribute('aria-busy');
    button.disabled = false;
    label.textContent = button.dataset.idleLabel ?? label.textContent;
  }
}

function initCard(card: HTMLElement): void {
  const step1 = card.querySelector<HTMLFormElement>('form[data-step="1"]');
  const step2 = card.querySelector<HTMLFormElement>('form[data-step="2"]');
  const success = card.querySelector<HTMLElement>('[data-step="success"]');
  const alertBox = card.querySelector<HTMLElement>('[data-form-alert]');
  if (!step1 || !success) return;

  const formId = card.dataset.formId ?? 'form';
  // The phone number comes from business.json through the card, never typed in here.
  const PHONE = card.dataset.phone ?? '';
  const TEL = card.dataset.tel ?? '';
  const startedAt = Date.now();
  let captured: Values = {};

  const show = (el: HTMLElement) => {
    for (const pane of card.querySelectorAll<HTMLElement>('[data-step]')) pane.hidden = pane !== el;
    const heading = el.querySelector<HTMLElement>('h2[tabindex="-1"]');
    heading?.focus({ preventScroll: true });
    // Keep the card in view when it changes height on a phone.
    const top = card.getBoundingClientRect().top;
    if (top < 80) card.scrollIntoView({ block: 'start', behavior: 'auto' });
  };

  const showAlert = (html: string | null) => {
    if (!alertBox) return;
    alertBox.hidden = !html;
    alertBox.innerHTML = html ?? '';
  };

  const base = () => ({
    form_id: formId,
    page_url: location.href.slice(0, 500),
    schema_version: SCHEMA_VERSION,
    lead_key: leadKey(),
    attribution: getAttribution(),
  });

  const fields = [...step1.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[name]')].filter(
    (f) => f.name in validators,
  );
  for (const field of fields) {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.getAttribute('aria-invalid')) validateField(field);
    });
  }

  step1.addEventListener('submit', async (event) => {
    event.preventDefault();
    showAlert(null);

    const invalid = fields.filter((field) => !validateField(field));
    if (invalid.length) {
      invalid[0].focus();
      const name = labels[invalid[0].name] ?? 'highlighted';
      showAlert(`Check the ${name} field above. Or call or text us at <a href="${TEL}" class="font-bold whitespace-nowrap">${PHONE}</a>.`);
      return;
    }

    const data = new FormData(step1);
    const get = (name: string) => String(data.get(name) ?? '').trim();
    const reasonSelect = step1.querySelector<HTMLSelectElement>('select[name="reason"]');
    const reasonLabel = reasonSelect?.selectedOptions[0]?.dataset.label ?? '';
    const notes = [card.dataset.variant === 'contact' ? `Needs: ${reasonLabel}` : '', get('notes')].filter(Boolean).join('\n');

    captured = {
      full_name: get('full_name'),
      phone: get('phone'),
      email: get('email'),
      zip: get('zip'),
      reason: get('reason'),
      consent_sms: data.get('consent_sms') === 'on',
      consent_text_version: card.dataset.consentVersion ?? '',
    };
    const payload = {
      ...captured,
      ...(get('address_street') ? { address_street: get('address_street') } : {}),
      ...(notes ? { notes } : {}),
      ...base(),
      step: 1,
      company_website: get('company_website'),
      elapsed_ms: Date.now() - startedAt,
    };

    const next = step2 ?? success;

    // Bots: a filled honeypot or an impossibly fast submit gets a fake success and no request.
    if (payload.company_website || payload.elapsed_ms < MIN_MS) {
      show(next);
      return;
    }

    const button = step1.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    setBusy(button, true);
    try {
      const res = await postLead(payload);
      if (!res.ok) throw new Error('lead rejected');
      dequeue(payload);
      track('generate_lead', { reason: String(captured.reason), source_detail: res.source_detail });
      show(next);
    } catch {
      // Keep the lead: it is replayed on the next page view. Never tell someone
      // the form broke without the phone number beside it.
      enqueue(payload);
      showAlert(
        `We could not send that just now. Call or text us at <a href="${TEL}" class="font-bold whitespace-nowrap">${PHONE}</a>, or press the button to try again.`,
      );
    } finally {
      setBusy(button, false);
    }
  });

  if (step2) {
    const finish = async (send: boolean) => {
      if (send) {
        const data = new FormData(step2);
        const get = (name: string) => String(data.get(name) ?? '').trim();
        const bestTime = get('best_time');
        const extra = {
          ...(get('address_street') ? { address_street: get('address_street') } : {}),
          ...(get('roof_age') ? { roof_age: get('roof_age') } : {}),
          ...(get('urgency') ? { urgency: get('urgency') } : {}),
          ...(bestTime ? { notes: `Best time to reach: ${bestTime}` } : {}),
        };
        if (Object.keys(extra).length) {
          const payload = { ...captured, ...extra, ...base(), step: 2 };
          const button = step2.querySelector<HTMLButtonElement>('button[type="submit"]')!;
          setBusy(button, true);
          try {
            await postLead(payload);
            track('lead_qualified', { urgency: get('urgency') });
          } catch {
            enqueue(payload);
          } finally {
            setBusy(button, false);
          }
        }
      }
      show(success);
    };
    step2.addEventListener('submit', (event) => {
      event.preventDefault();
      void finish(true);
    });
    step2.querySelector('[data-action="skip"]')?.addEventListener('click', () => void finish(false));
  }
}

for (const card of document.querySelectorAll<HTMLElement>('[data-lead-card]')) initCard(card);
