// Site-wide behavior. Small, dependency-free, loaded on every page.
import { captureAttribution, retryQueue } from './attribution';

const $ = <T extends HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];

captureAttribution();

// Header: shrink once the page has scrolled.
const header = $('[data-site-header]');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Services dropdown: hover and focus are CSS; click, escape and outside click are here.
for (const dropdown of $$('[data-dropdown]')) {
  const toggle = $<HTMLButtonElement>('[data-dropdown-toggle]', dropdown);
  if (!toggle) continue;
  const set = (open: boolean) => {
    dropdown.toggleAttribute('data-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => {
    dropdown.removeAttribute('data-closed');
    set(!dropdown.hasAttribute('data-open'));
  });
  dropdown.addEventListener('mouseleave', () => dropdown.removeAttribute('data-closed'));
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const wasInside = dropdown.contains(document.activeElement);
    set(false);
    // Hide it even while the pointer is still hovering or focus is still inside.
    dropdown.setAttribute('data-closed', '');
    if (wasInside) toggle.focus();
  });
  dropdown.addEventListener('focusin', () => dropdown.removeAttribute('data-closed'));
  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target as Node)) set(false);
  });
}

// Mobile nav panel.
const panel = $('#mobile-nav');
const opener = $<HTMLButtonElement>('[data-action="menu"]');
if (panel && opener) {
  const focusables = () =>
    $$('a[href], button:not([disabled])', panel).filter((el) => el.offsetParent !== null);
  const close = () => {
    panel.classList.remove('is-open');
    opener.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    window.setTimeout(() => (panel.hidden = true), 300);
    opener.focus();
  };
  const open = () => {
    panel.hidden = false;
    // Next frame, so the slide-in transition runs.
    requestAnimationFrame(() => panel.classList.add('is-open'));
    opener.setAttribute('aria-expanded', 'true');
    document.documentElement.style.overflow = 'hidden';
    $<HTMLButtonElement>('[data-action="close"]', panel)?.focus();
  };
  opener.addEventListener('click', open);
  $('[data-action="close"]', panel)?.addEventListener('click', close);
  panel.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
    if (event.key !== 'Tab') return;
    const items = focusables();
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  const group = $<HTMLButtonElement>('[data-action="services"]', panel);
  group?.addEventListener('click', () => {
    const list = document.getElementById(group.getAttribute('aria-controls') ?? '');
    const expanded = group.getAttribute('aria-expanded') === 'true';
    group.setAttribute('aria-expanded', String(!expanded));
    if (list) list.hidden = expanded;
  });
  // Leaving the phone breakpoint with the panel open would leave the page locked.
  window.matchMedia('(min-width: 900px)').addEventListener('change', (mq) => {
    if (mq.matches && panel.classList.contains('is-open')) close();
  });
}

// Footer services accordion (mobile).
for (const button of $$<HTMLButtonElement>('[data-action="accordion"]')) {
  button.addEventListener('click', () => {
    const list = document.getElementById(button.getAttribute('aria-controls') ?? '');
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    list?.classList.toggle('is-open', !expanded);
  });
}

// FAQ accordions. Answers are in the HTML; CSS hides the closed ones once JS is confirmed.
// Review cards: "Read more" expands a clamped review in place.
for (const toggle of $$<HTMLButtonElement>('[data-review-toggle]')) {
  const text = toggle.previousElementSibling as HTMLElement | null;
  if (!text) continue;
  toggle.addEventListener('click', () => {
    const open = !text.hasAttribute('data-open');
    text.toggleAttribute('data-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Show less' : 'Read more';
  });
}

for (const trigger of $$<HTMLButtonElement>('[data-faq-trigger]')) {
  trigger.addEventListener('click', () => {
    const answer = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
    const expanded = trigger.getAttribute('aria-expanded') === 'true';
    trigger.setAttribute('aria-expanded', String(!expanded));
    answer?.toggleAttribute('data-open', !expanded);
  });
}

// In-page "go to the form" buttons. Buttons, not "#" links (design/README.md).
for (const button of $$('[data-action="lead-card"]')) {
  button.addEventListener('click', () => {
    const card = $('[data-lead-card]');
    if (!card) return;
    card.scrollIntoView({ block: 'center' });
    const field = $<HTMLInputElement>('input:not([type="checkbox"]):not([tabindex="-1"])', card);
    // Focus without a second scroll jump; on phones this also raises the keyboard.
    window.setTimeout(() => field?.focus({ preventScroll: true }), 350);
  });
}

// Sticky bottom CTA: after the hero has scrolled out, never while a lead form is on screen.
const sticky = $('[data-sticky-cta]');
if (sticky && 'IntersectionObserver' in window) {
  const hero = $('[data-hero]');
  const cards = $$('[data-lead-card]');
  let heroVisible = !!hero;
  let formVisible = false;
  const update = () => {
    const visible = !heroVisible && !formVisible;
    sticky.classList.toggle('is-visible', visible);
    sticky.toggleAttribute('inert', !visible);
    sticky.setAttribute('aria-hidden', String(!visible));
  };
  if (hero) {
    new IntersectionObserver(([entry]) => {
      heroVisible = entry.isIntersecting;
      update();
    }).observe(hero);
  }
  const seen = new Set<Element>();
  const formObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) entry.isIntersecting ? seen.add(entry.target) : seen.delete(entry.target);
    formVisible = seen.size > 0;
    update();
  });
  for (const card of cards) formObserver.observe(card);
  update();
}

// Scroll reveal: fade up once, staggered within a group, never on scroll-back.
const reveals = $$('.reveal');
if (reveals.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -5% 0px' },
  );
  for (const el of reveals) observer.observe(el);
} else {
  for (const el of reveals) el.classList.add('is-visible');
}

// Rating chips: refresh from the same-origin proxy so the count is live between deploys.
const chips = $$('[data-rating-chip]');
const counts = $$('[data-rating-count]');
if (chips.length || counts.length) {
  const refresh = async () => {
    try {
      const res = await fetch('/api/reviews/');
      if (!res.ok) return;
      const data = (await res.json()) as { rating?: number; count?: number; source?: string };
      if (data.source !== 'live' || !data.rating || !data.count) return;
      for (const el of counts) el.textContent = String(data.count);
      for (const el of $$('[data-rating-value]')) el.textContent = data.rating.toFixed(1);
    } catch {
      // The build-time value stays.
    }
  };
  if ('requestIdleCallback' in window) requestIdleCallback(() => void refresh(), { timeout: 4000 });
  else window.setTimeout(() => void refresh(), 2500);
}

// Replay any lead whose POST failed on an earlier page view.
window.addEventListener('load', () => void retryQueue());
