// Parses the approved copy batches (copy/batch-*.md) into structured pages.
//
// The site never retypes copy. Every heading, paragraph, list, FAQ and CTA on
// a page comes out of this parser, and FAQPage schema is generated from the
// same blocks as the visible accordion, so the two cannot drift
// (CLAUDE.md rule 2, master prompt section 15).
//
// The parser fails loudly: an unknown tag or a line it cannot place throws at
// build time with the batch and line number. Silence is the defect.

// Guides and blog posts (copy/guides-*.md, copy/blog-*.md, ADR-018) use the
// same format plus four tags.
const files = import.meta.glob(['../../copy/batch-*.md', '../../copy/guides-*.md', '../../copy/blog-*.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export type Inline =
  | { t: 'text'; v: string }
  | { t: 'strong'; v: string }
  | { t: 'confirm'; v: string }
  | { t: 'link'; text: string; href: string };

export interface TextBlock {
  type: 'h1' | 'subhead' | 'h2' | 'h3' | 'p';
  inline: Inline[];
}
export interface ListItem {
  title: string | null;
  inline: Inline[];
}
export interface ListBlock {
  type: 'list';
  items: ListItem[];
}
export interface StepsBlock {
  type: 'steps';
  items: { title: string; inline: Inline[] }[];
}
export interface CardBlock {
  type: 'card';
  title: string;
  inline: Inline[];
  href: string | null;
  soon: boolean;
  template: boolean;
}
export interface ReviewBlock {
  type: 'review';
  hint: string;
}
export interface FaqBlock {
  type: 'faq';
  q: string;
  a: Inline[];
}
export interface CtaBlock {
  type: 'cta';
  kind: 'primary' | 'secondary';
  label: string;
  href: string | null;
  confirm: string | null;
}
export interface TrustBlock {
  type: 'trust';
  items: Inline[][];
}
export interface LinksBlock {
  type: 'links';
  links: { text: string; href: string }[];
}
export interface ImageBlock {
  type: 'image';
  desc: string;
  confirm: string | null;
}
export interface FormBlock {
  type: 'form';
  text: string;
}
/** Guide author line: "By Ricardo Castro, owner of ... · Published November 2026". */
export interface BylineBlock {
  type: 'byline';
  author: Inline[];
  date: string | null;
}
/** A comparison table; the first row is the header. */
export interface TableBlock {
  type: 'table';
  rows: Inline[][][];
}
/** A visible disclaimer callout. */
export interface NoteBlock {
  type: 'note';
  inline: Inline[];
}
/** A guide's call to action sentence, drawn mid-article. */
export interface ActionBlock {
  type: 'action';
  inline: Inline[];
}
export type Block =
  | TextBlock
  | ListBlock
  | StepsBlock
  | CardBlock
  | ReviewBlock
  | FaqBlock
  | CtaBlock
  | TrustBlock
  | LinksBlock
  | ImageBlock
  | FormBlock
  | BylineBlock
  | TableBlock
  | NoteBlock
  | ActionBlock;

export interface Section {
  name: string;
  blocks: Block[];
}
export interface CopyPage {
  url: string;
  batch: string;
  title: string;
  metaTitle: string;
  metaDescription: Inline[];
  primaryKeyword: string;
  schema: string;
  /** A page-level [CONFIRM] above the spec, for example the city page publish gate. */
  gate: string | null;
  sections: Section[];
  internalLinks: string[];
  /** Guides and posts: ISO dates from the spec. modified is set only when the content changes. */
  published: string | null;
  modified: string | null;
  /** Guides and posts: the footer and menu label. */
  shortTitle: string | null;
  /** Guides and posts: the one line on the Resources and blog cards. */
  summary: Inline[] | null;
}

const SPEC_KEYS = new Set([
  '[URL]',
  '[META TITLE]',
  '[META DESCRIPTION]',
  '[SCHEMA]',
  'Primary keyword',
  'Supporting keywords',
  'Kept from current site',
  'Source',
  'Source note',
  'Dropped',
  'Rule',
  '[PUBLISHED]',
  '[MODIFIED]',
  '[SHORT TITLE]',
  '[SUMMARY]',
]);

const TAGS = [
  'H1',
  'SUBHEAD',
  'H2',
  'H3',
  'P',
  'LIST',
  'STEPS',
  'TRUST BAR',
  'CTA PRIMARY',
  'CTA SECONDARY',
  'CARD',
  'REVIEW',
  'FAQ Q',
  'FAQ A',
  'LINK',
  'IMAGE',
  'FORM',
  'BYLINE',
  'TABLE',
  'NOTE',
  'CTA',
];
const TAG_RE = new RegExp(`^\\**\\[(${TAGS.join('|')})\\]\\**\\s*(.*)$`);

const unescape = (s: string) => s.replace(/\\([|#+=\-.!()[\]_*])/g, '$1');

/** Label shown inside a CONFIRM placeholder. */
function confirmLabel(raw: string): string {
  const v = raw.replace(/^:\s*/, '').trim();
  return v || 'confirm with Ricardo';
}

const INLINE_RE =
  /\[CONFIRM([^\]]*)\]|\[LINK\]\s*([^→[]+?)\s*→\s*(\/[^\s·]*)|\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let last = 0;
  const push = (v: string) => {
    if (!v) return;
    const prev = out[out.length - 1];
    if (prev && prev.t === 'text') prev.v += v;
    else out.push({ t: 'text', v });
  };
  for (const m of src.matchAll(INLINE_RE)) {
    push(src.slice(last, m.index));
    if (m[1] !== undefined) out.push({ t: 'confirm', v: confirmLabel(m[1]) });
    else if (m[2] !== undefined) out.push({ t: 'link', text: m[2].trim(), href: m[3] });
    else if (m[4] !== undefined) out.push({ t: 'link', text: m[4], href: m[5] });
    else if (m[6] !== undefined) out.push({ t: 'strong', v: m[6] });
    last = m.index! + m[0].length;
  }
  push(src.slice(last));
  // Tidy the whitespace left behind where a token sat mid-sentence.
  for (const node of out) if (node.t === 'text') node.v = node.v.replace(/\s{2,}/g, ' ');
  if (out[0]?.t === 'text') out[0].v = out[0].v.replace(/^\s+/, '');
  const tail = out[out.length - 1];
  if (tail?.t === 'text') tail.v = tail.v.replace(/\s+$/, '');
  return out.filter((n) => n.t !== 'text' || n.v !== '');
}

/** Plain text of an inline run. CONFIRM slots are left out; link text is kept. */
export function plain(inline: Inline[]): string {
  return inline
    .map((n) => (n.t === 'text' || n.t === 'strong' ? n.v : n.t === 'link' ? n.text : ''))
    .join('')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;:])/g, '$1')
    .trim();
}

export const hasConfirm = (inline: Inline[]) => inline.some((n) => n.t === 'confirm');

function splitTitle(body: string): { title: string | null; rest: string } {
  const bold = body.match(/^\*\*(.+?)\*\*\s*(.*)$/);
  if (bold) return { title: bold[1].trim(), rest: bold[2] };
  return { title: null, rest: body };
}

/** "Stay safe. Don't climb on the roof." gives the title "Stay safe." */
function splitFirstSentence(body: string): { title: string; rest: string } {
  const bold = splitTitle(body);
  if (bold.title) return { title: bold.title, rest: bold.rest };
  const m = body.match(/^(.+?[.?!])\s+(.*)$/);
  if (m) return { title: m[1], rest: m[2] };
  return { title: body, rest: '' };
}

function parseCta(kind: 'primary' | 'secondary', body: string): CtaBlock {
  let label = body;
  let href: string | null = null;
  let confirm: string | null = null;
  const c = label.match(/\[CONFIRM([^\]]*)\]/);
  if (c) {
    confirm = confirmLabel(c[1]);
    label = label.replace(c[0], '');
  }
  // Internal routes and, since 2026-10-19, external links (the Enhancify application, the Google review link).
  const h = label.match(/→\s*((?:\/|https?:\/\/)\S*)/);
  if (h) {
    href = h[1];
    label = label.replace(h[0], '');
  }
  return { type: 'cta', kind, label: label.trim(), href, confirm };
}

function parseCard(body: string, where: string): CardBlock {
  const parts = body.split(/\s+\|\s+/);
  if (parts.length < 3) throw new Error(`${where}: [CARD] needs "title | text | /url/", got: ${body}`);
  const [title, text, target] = parts;
  const hrefMatch = target.match(/^(\/\S*)/);
  return {
    type: 'card',
    title: title.trim(),
    inline: parseInline(text.trim()),
    href: hrefMatch ? hrefMatch[1] : null,
    soon: /^coming soon$/i.test(text.trim()),
    template: title.trim().startsWith('['),
  };
}

function parseLinks(body: string): LinksBlock {
  const links = body
    .split(/\s+·\s+/)
    .map((part) => part.match(/^(.+?)\s*→\s*(\/\S*)$/))
    .filter((m): m is RegExpMatchArray => !!m)
    .map((m) => ({ text: m[1].trim(), href: m[2] }));
  return { type: 'links', links };
}

function parseBatch(path: string, raw: string): CopyPage[] {
  const batch = path.split('/').pop()!;
  const lines = raw.split('\n').map((l) => unescape(l.replace(/\s+$/, '')));
  const pages: CopyPage[] = [];

  let page: CopyPage | null = null;
  let spec: Record<string, string> = {};
  let state: 'out' | 'pre' | 'spec' | 'body' = 'out';
  let pendingKey: string | null = null;
  let section: Section | null = null;
  let pendingQ: string | null = null;

  const finish = () => {
    if (!page) return;
    if (!spec['[URL]']) throw new Error(`${batch}: page "${page.title}" has no [URL]`);
    page.url = spec['[URL]'].split(/\s/)[0];
    page.metaTitle = spec['[META TITLE]'] ?? '';
    page.metaDescription = parseInline(spec['[META DESCRIPTION]'] ?? '');
    page.primaryKeyword = (spec['Primary keyword'] ?? '').replace(/\s*\(.*$/, '').trim();
    page.schema = spec['[SCHEMA]'] ?? '';
    page.published = spec['[PUBLISHED]'] ?? null;
    page.modified = spec['[MODIFIED]'] ?? null;
    page.shortTitle = spec['[SHORT TITLE]'] ?? null;
    page.summary = spec['[SUMMARY]'] ? parseInline(spec['[SUMMARY]']) : null;
    pages.push(page);
    page = null;
  };

  lines.forEach((line, i) => {
    const where = `${batch}:${i + 1}`;
    const heading = line.match(/^## \d+\. (Page|Template): (.+)$/);
    if (heading) {
      finish();
      page = {
        url: '',
        batch,
        title: heading[2].trim(),
        metaTitle: '',
        metaDescription: [],
        primaryKeyword: '',
        schema: '',
        gate: null,
        sections: [],
        internalLinks: [],
        published: null,
        modified: null,
        shortTitle: null,
        summary: null,
      };
      spec = {};
      state = 'pre';
      pendingKey = null;
      section = null;
      pendingQ = null;
      return;
    }
    if (/^## /.test(line) || /^-{3,}$/.test(line)) {
      finish();
      state = 'out';
      return;
    }
    if (state === 'out' || !page || !line.trim()) return;
    const text = line.trim();

    if (state === 'pre') {
      if (/^\**Page spec\**$/.test(text)) state = 'spec';
      else if (/^\[CONFIRM/.test(text)) page.gate = confirmLabel(text.replace(/^\[CONFIRM/, '').replace(/\]$/, ''));
      return;
    }

    if (state === 'spec') {
      if (text.startsWith('|')) {
        const cells = text.replace(/^\|\s*/, '').replace(/\s*\|$/, '').split(/\s+\|\s+/);
        if (SPEC_KEYS.has(cells[0])) spec[cells[0]] = cells.slice(1).join(' | ').trim();
        return;
      }
      if (text === 'Field' || text === 'Value') return;
      if (pendingKey) {
        spec[pendingKey] = text;
        pendingKey = null;
        return;
      }
      if (SPEC_KEYS.has(text)) {
        pendingKey = text;
        return;
      }
      state = 'body';
    }

    // body
    const internal = text.match(/^\**Internal links on this page:\**\s*(.*)$/);
    if (internal) {
      page.internalLinks = internal[1]
        .split(/\s+·\s+/)
        .filter((part) => !/when published/i.test(part))
        .map((part) => part.match(/^(\/[a-z0-9\-/]*)/)?.[1])
        .filter((p): p is string => !!p);
      return;
    }

    const tag = text.match(TAG_RE);
    if (tag) {
      if (!section) throw new Error(`${where}: tagged line before any section label: ${text}`);
      const [, name, body] = tag;
      const blocks = section.blocks;
      switch (name) {
        case 'H1':
          blocks.push({ type: 'h1', inline: parseInline(body) });
          break;
        case 'SUBHEAD':
          blocks.push({ type: 'subhead', inline: parseInline(body) });
          break;
        case 'H2':
          blocks.push({ type: 'h2', inline: parseInline(body) });
          break;
        case 'H3':
          blocks.push({ type: 'h3', inline: parseInline(body) });
          break;
        case 'P':
          // Build notes are instructions to the builder, not page copy.
          if (/^Build note/i.test(body)) break;
          blocks.push({ type: 'p', inline: parseInline(body) });
          break;
        case 'LIST':
          blocks.push({ type: 'list', items: [] });
          break;
        case 'STEPS':
          blocks.push({ type: 'steps', items: [] });
          break;
        case 'TRUST BAR':
          blocks.push({ type: 'trust', items: body.split(/\s+·\s+/).map(parseInline) });
          break;
        case 'CTA PRIMARY':
          blocks.push(parseCta('primary', body));
          break;
        case 'CTA SECONDARY':
          blocks.push(parseCta('secondary', body));
          break;
        case 'CARD':
          blocks.push(parseCard(body, where));
          break;
        case 'REVIEW':
          blocks.push({ type: 'review', hint: body.replace(/^\[|\]$/g, '').trim() });
          break;
        case 'FAQ Q':
          pendingQ = body;
          break;
        case 'FAQ A':
          if (!pendingQ) throw new Error(`${where}: [FAQ A] without a question`);
          blocks.push({ type: 'faq', q: pendingQ, a: parseInline(body) });
          pendingQ = null;
          break;
        case 'LINK':
          blocks.push(parseLinks(body));
          break;
        case 'IMAGE': {
          const c = body.match(/\[CONFIRM([^\]]*)\]/);
          blocks.push({
            type: 'image',
            desc: body.replace(/\[CONFIRM[^\]]*\]/, '').trim(),
            confirm: c ? confirmLabel(c[1]) : null,
          });
          break;
        }
        case 'FORM':
          blocks.push({ type: 'form', text: body });
          break;
        case 'BYLINE': {
          const [author, date] = body.split(/\s+·\s+Published\s+/);
          blocks.push({ type: 'byline', author: parseInline(author), date: date?.trim() ?? null });
          break;
        }
        case 'TABLE':
          blocks.push({ type: 'table', rows: [] });
          break;
        case 'NOTE':
          blocks.push({ type: 'note', inline: parseInline(body) });
          break;
        case 'CTA':
          blocks.push({ type: 'action', inline: parseInline(body) });
          break;
      }
      return;
    }

    if (text.startsWith('|')) {
      const last = section?.blocks[section.blocks.length - 1];
      if (!last || last.type !== 'table') throw new Error(`${where}: table row outside a [TABLE]: ${text}`);
      last.rows.push(text.replace(/^\|\s*/, '').replace(/\s*\|$/, '').split(/\s*\|\s*/).map((cell) => parseInline(cell)));
      return;
    }

    const bullet = text.match(/^-\s+(.*)$/);
    if (bullet) {
      const last = section?.blocks[section.blocks.length - 1];
      if (!last || last.type !== 'list') throw new Error(`${where}: list item outside a [LIST]: ${text}`);
      const { title, rest } = splitTitle(bullet[1]);
      last.items.push({ title, inline: parseInline(rest) });
      return;
    }
    const numbered = text.match(/^\d+\.\s+(.*)$/);
    if (numbered) {
      const last = section?.blocks[section.blocks.length - 1];
      if (!last || last.type !== 'steps') throw new Error(`${where}: numbered item outside [STEPS]: ${text}`);
      const { title, rest } = splitFirstSentence(numbered[1]);
      last.items.push({ title, inline: parseInline(rest) });
      return;
    }

    if (text.startsWith('[')) throw new Error(`${where}: unknown tag, refusing to drop copy: ${text}`);

    // Anything else in the body is a section label ("Hero", "Why us", ...).
    section = { name: text.replace(/^\*\*|\*\*$/g, '').trim(), blocks: [] };
    page.sections.push(section);
  });
  finish();
  return pages;
}

const all: CopyPage[] = Object.entries(files)
  .sort(([a], [b]) => a.localeCompare(b))
  .flatMap(([path, raw]) => parseBatch(path, raw));

const byUrl = new Map(all.map((p) => [p.url, p]));

export function getPage(url: string): CopyPage {
  const page = byUrl.get(url);
  if (!page) throw new Error(`No copy for ${url}. Known: ${[...byUrl.keys()].join(', ')}`);
  return page;
}
export const allCopyPages = all;

/** The section with this label. Throws if the copy does not have it, so a renamed section cannot vanish silently. */
export function section(page: CopyPage, name: string): Section {
  const s = page.sections.find((x) => x.name.toLowerCase() === name.toLowerCase());
  if (!s) throw new Error(`${page.url}: no section "${name}". Has: ${page.sections.map((x) => x.name).join(', ')}`);
  return s;
}
export function maybeSection(page: CopyPage, name: string): Section | null {
  return page.sections.find((x) => x.name.toLowerCase() === name.toLowerCase()) ?? null;
}

export function blocksOf<T extends Block['type']>(s: Section, type: T): Extract<Block, { type: T }>[] {
  return s.blocks.filter((b): b is Extract<Block, { type: T }> => b.type === type);
}
export function first<T extends Block['type']>(s: Section, type: T): Extract<Block, { type: T }> | null {
  return blocksOf(s, type)[0] ?? null;
}
export function faqs(page: CopyPage): FaqBlock[] {
  return page.sections.flatMap((s) => blocksOf(s, 'faq'));
}
