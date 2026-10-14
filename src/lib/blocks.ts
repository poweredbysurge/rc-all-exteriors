// Helpers for laying out parsed copy blocks.
import { plain, type Block, type Inline, type ListItem, type Section } from '@/lib/copy';

/**
 * Batch 1 marks list titles in bold ("**Tear-off and disposal.** The old roof...").
 * Batches 2 to 5 write the same pattern without the bold ("Leak detection. Water
 * travels..."). When every item in a list opens with a short titled sentence,
 * treat it as a titled list so both render the same way.
 */
export function asTitled(items: ListItem[]): ListItem[] | null {
  const out: ListItem[] = [];
  for (const item of items) {
    if (item.title) {
      out.push(item);
      continue;
    }
    const head = item.inline[0];
    if (!head || head.t !== 'text') return null;
    const m = head.v.match(/^([A-Z][^.?!]{2,40}\.)\s*(.*)$/s);
    if (!m || m[1].split(/\s+/).length > 4) return null;
    const rest: Inline[] = [...(m[2] ? [{ t: 'text' as const, v: m[2] }] : []), ...item.inline.slice(1)];
    if (!rest.length) return null;
    out.push({ title: m[1], inline: rest });
  }
  return out.length ? out : null;
}

/** A line icon for a heading, chosen from the words in it. Names are from design/icons.md. */
export function iconFor(text: string): string {
  const t = text.toLowerCase();
  if (/pric|estimate|quote/.test(t)) return 'file-text';
  if (/warranty|backed|protection/.test(t)) return 'shield-check';
  if (/owner|honest|licen[cs]/.test(t)) return 'badge-check';
  if (/clean|on time/.test(t)) return 'trash-2';
  if (/financ|pay/.test(t)) return 'credit-card';
  if (/insurance|storm/.test(t)) return 'cloud-lightning';
  if (/local|woodbridge/.test(t)) return 'map-pin';
  if (/phone|answer|show up/.test(t)) return 'phone';
  if (/commercial|residential/.test(t)) return 'building-2';
  if (/metal/.test(t)) return 'layers';
  if (/shingle/.test(t)) return 'house';
  if (/certainteed/.test(t)) return 'award';
  return 'check';
}

export interface Group {
  heading: Extract<Block, { type: 'h3' }> | null;
  blocks: Block[];
}

/** Splits a run of blocks at each H3, so "H3, P, H3, P" becomes two groups. */
export function groupByH3(blocks: Block[]): { lead: Block[]; groups: Group[] } {
  const lead: Block[] = [];
  const groups: Group[] = [];
  for (const block of blocks) {
    if (block.type === 'h3') groups.push({ heading: block, blocks: [] });
    else if (groups.length) groups[groups.length - 1].blocks.push(block);
    else lead.push(block);
  }
  return { lead, groups };
}

export type SectionKind = 'prose' | 'steps' | 'cards' | 'reviews' | 'h3grid' | 'split';

export function kindOf(section: Section): SectionKind {
  const has = (type: Block['type']) => section.blocks.some((b) => b.type === type);
  if (!has('h2')) return 'prose';
  if (has('steps')) return 'steps';
  if (has('card')) return 'cards';
  if (has('review')) return 'reviews';
  if (section.blocks.filter((b) => b.type === 'h3').length >= 2) return 'h3grid';
  return 'split';
}

/** Rough word count of a section, for placing density breakers and CTA bands. */
export function wordCount(section: Section): number {
  const text = section.blocks
    .map((b) => {
      switch (b.type) {
        case 'h1':
        case 'subhead':
        case 'h2':
        case 'h3':
        case 'p':
          return plain(b.inline);
        case 'list':
        case 'steps':
          return b.items.map((i) => `${i.title ?? ''} ${plain(i.inline)}`).join(' ');
        case 'faq':
          return `${b.q} ${plain(b.a)}`;
        case 'card':
          return `${b.title} ${plain(b.inline)}`;
        default:
          return '';
      }
    })
    .join(' ');
  return text.split(/\s+/).filter(Boolean).length;
}
