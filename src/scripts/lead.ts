// Lead card behavior (master prompt section 10, ADR-005).
//
//  - step 1 is two panes: reason (one tap advances) then contact; the contact
//    pane's submit is the step 1 POST that captures the lead
//  - step 2 is one question per pane, Next until the last, then Finish; Skip
//    is always visible and the lead captured in step 1 can never be lost
//  - validation on blur and on submit, inline errors, first invalid field focused
//  - honeypot filled, or a submit inside 3 seconds of first render: fake
//    success, nothing sent
//  - POST /api/lead/; on 2xx the card moves to step 2 and GA4 generate_lead fires
//  - on failure the payload is queued in localStorage and replayed on the next
//    page view, and the visitor sees retry copy with the phone number
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

// Pages a form's [data-pane] groups one at a time: back link, "n of N"
// counter, progress bar, focus into the pane. Returns null for a form with
// fewer than two panes, which then renders as one card.
interface Pager {
  index: () => number;
  isLast: () => boolean;
  next: () => void;
  back: () => void;
  reset: () => void;
}
function initPanes(form: HTMLFormElement, onChange?: (index: number) => void): Pager | null {
  const panes = [...form.querySelectorAll<HTMLElement>('[data-pane]')];
  if (panes.length < 2) return null;
  const backBtn = form.querySelector<HTMLButtonElement>('[data-action="back"]');
  const count = form.querySelector<HTMLElement>('[data-quiz-count]');
  const sub = form.querySelector<HTMLElement>('[data-quiz-sub]');
  const bar = form.querySelector<HTMLElement>('[data-quiz-bar] i');
  let idx = 0;

  const render = (moveFocus: boolean) => {
    panes.forEach((pane, i) => (pane.hidden = i !== idx));
    if (count) count.textContent = `${idx + 1} of ${panes.length}`;
    if (sub) sub.hidden = idx > 0;
    if (bar) bar.style.width = `${Math.round(((idx + 1) / panes.length) * 100)}%`;
    if (backBtn) backBtn.hidden = idx === 0;
    onChange?.(idx);
    if (moveFocus) {
      const target =
        panes[idx].querySelector<HTMLElement>('[data-pane-title]') ??
        panes[idx].querySelector<HTMLElement>('input:not([type="hidden"]), select, textarea');
      target?.focus({ preventScroll: true });
    }
  };

  backBtn?.addEventListener('click', () => {
    if (idx > 0) {
      idx -= 1;
      render(true);
    }
  });
  render(false);

  return {
    index: () => idx,
    isLast: () => idx === panes.length - 1,
    next: () => {
      if (idx < panes.length - 1) {
        idx += 1;
        render(true);
      }
    },
    back: () => {
      if (idx > 0) {
        idx -= 1;
        render(true);
      }
    },
    reset: () => {
      idx = 0;
      render(false);
    },
  };
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

  const keepInView = () => {
    const top = card.getBoundingClientRect().top;
    if (top < 80) card.scrollIntoView({ block: 'start', behavior: 'auto' });
  };

  const show = (el: HTMLElement) => {
    for (const pane of card.querySelectorAll<HTMLElement>('[data-step]')) pane.hidden = pane !== el;
    const heading = el.querySelector<HTMLElement>('h2[tabindex="-1"]');
    heading?.focus({ preventScroll: true });
    keepInView();
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

  // Step 1 panes: reason, then contact. A tap on a reason advances.
  const pager1 = initPanes(step1, keepInView);
  const reasonRadios = [...step1.querySelectorAll<HTMLInputElement>('input[name="reason"]')];
  for (const radio of reasonRadios) {
    radio.addEventListener('change', () => {
      if (!pager1 || pager1.index() !== 0) return;
      // Let the selected state paint before the pane slides.
      window.setTimeout(() => pager1.next(), 120);
    });
  }

  const fields = [...step1.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[name]')].filter(
    (f) => f.name in validators && f.name !== 'reason',
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

    const data = new FormData(step1);
    const get = (name: string) => String(data.get(name) ?? '').trim();

    // Enter on pane 1 with nothing chosen: stay. With a choice: go to contact.
    if (pager1 && pager1.index() === 0) {
      if (get('reason')) pager1.next();
      return;
    }

    const reasonError = validators.reason(get('reason'));
    if (reasonError) {
      pager1?.reset();
      showAlert(`Choose what's going on first. Or call or text us at <a href="${TEL}" class="font-bold whitespace-nowrap">${PHONE}</a>.`);
      return;
    }

    const invalid = fields.filter((field) => !validateField(field));
    if (invalid.length) {
      invalid[0].focus();
      const name = labels[invalid[0].name] ?? 'highlighted';
      showAlert(`Check the ${name} field above. Or call or text us at <a href="${TEL}" class="font-bold whitespace-nowrap">${PHONE}</a>.`);
      return;
    }

    const reasonRadio = step1.querySelector<HTMLInputElement>('input[name="reason"]:checked');
    const reasonLabel = reasonRadio?.dataset.label ?? '';
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
    const submit = step2.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    const label = submit.querySelector<HTMLElement>('[data-label]')!;
    const pager2 = initPanes(step2, (i) => {
      const panes = step2.querySelectorAll('[data-pane]').length;
      label.textContent = i === panes - 1 ? (submit.dataset.finishLabel ?? 'Finish') : (submit.dataset.nextLabel ?? 'Next');
    });

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
          setBusy(submit, true);
          try {
            await postLead(payload);
            track('lead_qualified', { urgency: get('urgency') });
          } catch {
            enqueue(payload);
          } finally {
            setBusy(submit, false);
          }
        }
      }
      show(success);
    };
    step2.addEventListener('submit', (event) => {
      event.preventDefault();
      // Next until the last pane; nothing is sent until Finish.
      if (pager2 && !pager2.isLast()) {
        pager2.next();
        return;
      }
      void finish(true);
    });
    // Skip sends nothing, as on HomeSource: step 2 posts only from Finish.
    step2.querySelector('[data-action="skip"]')?.addEventListener('click', () => void finish(false));
  }
}

for (const card of document.querySelectorAll<HTMLElement>('[data-lead-card]')) initCard(card);
