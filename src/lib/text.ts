// Headings render in sentence case (ADR-002, design/README.md). The copy
// writes H1s and card titles in title case for the title tag, so the display
// form is derived here instead of retyping the copy.

// Words and phrases that keep their capitals. Longest first.
const KEEP = [
  'RC All Exteriors LLC',
  'RC All Exteriors',
  'Northern Virginia',
  'Fairfax Station',
  'Fairfax County',
  'Great Falls',
  'Lake Ridge',
  'Class A',
  'CertainTeed',
  'Landmark Pro',
  'Landmark',
  'Woodbridge',
  'Springfield',
  'Alexandria',
  'Arlington',
  'Fairfax',
  'Lorton',
  'McLean',
  'Occoquan',
  'Virginia',
  'Ricardo',
  'Castro',
  'Google',
  'BBB',
  'SMS',
  'I-95',
  'VA',
  'GAF',
  'Owens Corning',
  'HOA',
];

export function sentenceCase(input: string): string {
  const held: string[] = [];
  let s = input;
  for (const phrase of KEEP) {
    const re = new RegExp(`(?<![A-Za-z])${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z])`, 'g');
    s = s.replace(re, () => {
      held.push(phrase);
      return `\u0000${held.length - 1}\u0000`;
    });
  }
  s = s.toLowerCase();
  // Capital at the start and after sentence punctuation.
  s = s.replace(/(^|[.?!]\s+)([a-z])/g, (_, lead, ch) => lead + ch.toUpperCase());
  return s.replace(/\u0000(\d+)\u0000/g, (_, i) => held[Number(i)]);
}

/** Wraps "10-year" style compounds and hours ("Mon to Fri", "Sat 8am to 4pm") so they never break across lines (Gate A review finding 4, ADR-016). */
export const NOWRAP_TERMS = /(\b\d+-year\b|\bClass A\b|\bMon to (?:Sat|Fri)\b|\bSat \d{1,2}am to \d{1,2}pm\b|\b\d{1,2}am to \d{1,2}pm\b)/g;

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
