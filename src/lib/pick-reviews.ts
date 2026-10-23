// Fills the copy's [REVIEW] slots from the live reviews. Each slot says what
// kind of review it wants ("mentions fair pricing"); the best unused match
// wins, and a slot with no live review left stays a labeled placeholder.
import type { Review } from '@/lib/reviews';

const THEMES: [RegExp, RegExp][] = [
  [/pric/i, /\b(pric|fair|cost|quote|estimate|afford)/i],
  [/insurance/i, /\b(insurance|claim|adjuster)/i],
  [/clean|crew/i, /\b(clean|crew|tidy|polite|team)/i],
  [/repair|quick/i, /\b(repair|leak|quick|fast|respons)/i],
];

/** A pullquote is set at heading size; past this it is a wall, not a quote (ADR-009). */
export const PULLQUOTE_MAX_WORDS = 50;
const words = (r: Review) => r.text.split(/\s+/).length;

export function pickReviews(reviews: Review[], hints: string[], opts: { pullquote?: number } = {}): (Review | null)[] {
  const pool = [...reviews];
  return hints.map((hint, slot) => {
    if (!pool.length) return null;
    const theme = THEMES.find(([wants]) => wants.test(hint));
    // The pullquote slot takes the best short review: on theme and under the
    // word cap, else the shortest under the cap, else the shortest there is.
    if (slot === opts.pullquote) {
      const short = pool.filter((r) => words(r) <= PULLQUOTE_MAX_WORDS);
      const pick =
        (theme && short.find((r) => theme[1].test(r.text))) ??
        [...(short.length ? short : pool)].sort((a, b) => words(a) - words(b))[0];
      return pool.splice(pool.indexOf(pick), 1)[0];
    }
    let index = theme ? pool.findIndex((r) => theme[1].test(r.text)) : -1;
    // A slot asking for a review from one town is never filled with a review from anywhere.
    if (/customer, if one exists/i.test(hint)) return null;
    if (index < 0) index = 0;
    return pool.splice(index, 1)[0];
  });
}
