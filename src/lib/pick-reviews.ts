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

export function pickReviews(reviews: Review[], hints: string[]): (Review | null)[] {
  const pool = [...reviews];
  return hints.map((hint) => {
    if (!pool.length) return null;
    const theme = THEMES.find(([wants]) => wants.test(hint));
    let index = theme ? pool.findIndex((r) => theme[1].test(r.text)) : -1;
    // A slot asking for a review from one town is never filled with a review from anywhere.
    if (/customer, if one exists/i.test(hint)) return null;
    if (index < 0) index = 0;
    return pool.splice(index, 1)[0];
  });
}
