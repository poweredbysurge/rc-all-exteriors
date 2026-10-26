// Inline copy to HTML. Shared by Rich.astro and anywhere a string of copy has
// to be rendered with its CONFIRM slots, links and phone number intact.
import type { Inline } from '@/lib/copy';
import business from '@/data/business.json';
import { getReviews } from '@/lib/reviews';
import { PHONE, TEL } from '@/lib/site';
import { NOWRAP_TERMS } from '@/lib/text';

// The copy states the review count in places ("49 five-star reviews"). At
// build the count comes from the reviews proxy, so any number the copy puts
// in front of "five-star", "Google" or "reviews" follows the live number,
// visible text and schema alike (master prompt 1.4, section 12: a review
// count is never a literal). With no Places key the proxy returns the
// fallback in business.json and the copy's number is replaced with that.
const reviews = await getReviews();
const COUNT_RE = /(?<![.\d])\b\d{1,4}(?=\s+(?:five-star|Google|reviews))/gi;
export const liveCount = (text: string) => text.replace(COUNT_RE, String(reviews.count));

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const PHONE_RE = new RegExp(PHONE.replace(/[()]/g, '\\$&'), 'g');

/** Escapes text, keeps "10-year" style terms on one line, and makes the phone number tappable. */
export function decorate(text: string, opts: { linkPhone?: boolean } = {}): string {
  let html = esc(liveCount(text)).replace(NOWRAP_TERMS, '<span class="whitespace-nowrap">$1</span>');
  if (opts.linkPhone !== false) html = html.replace(PHONE_RE, `<a href="${TEL}">${PHONE}</a>`);
  return html;
}

/** The visible placeholder for a [CONFIRM] slot. check-integrity counts data-confirm. */
export function confirmHtml(label: string): string {
  return `<span class="confirm" data-confirm="${esc(label)}"><span class="confirm-text">${esc(label)}</span><span class="confirm-tag">CONFIRM</span></span>`;
}

export function renderInline(inline: Inline[], opts: { linkPhone?: boolean } = {}): string {
  return inline
    .map((node) => {
      switch (node.t) {
        case 'text':
          return decorate(node.v, opts);
        case 'strong':
          return `<strong class="font-bold">${decorate(node.v, opts)}</strong>`;
        case 'confirm':
          return ` ${confirmHtml(node.v)} `;
        case 'link':
          // Off-site sources (the guides' statute links) open in a new tab.
          return /^https?:\/\//.test(node.href)
            ? `<a href="${esc(node.href)}" target="_blank" rel="noopener">${esc(liveCount(node.text))}</a>`
            : `<a href="${esc(node.href)}">${esc(liveCount(node.text))}</a>`;
      }
    })
    .join('')
    .replace(/\s{2,}/g, ' ')
    .trim();
}
