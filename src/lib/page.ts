// Page-level meta from the copy spec.
import { plain, type CopyPage } from '@/lib/copy';
import { liveCount } from '@/lib/render';

export function metaFor(page: CopyPage) {
  // A CONFIRM in the title or description cannot render as a visible slot, so
  // it is stripped from the tag and surfaced to check-integrity instead.
  const titleConfirms = [...page.metaTitle.matchAll(/\[CONFIRM:?\s*([^\]]*)\]/g)].map((m) => m[1].trim());
  const descConfirms = page.metaDescription.filter((n) => n.t === 'confirm').map((n) => (n as { v: string }).v);
  return {
    title: liveCount(page.metaTitle.replace(/\s*\[CONFIRM[^\]]*\]/g, '').trim()),
    description: liveCount(plain(page.metaDescription)),
    confirmMeta: [...titleConfirms, ...descConfirms].map((label) => `meta: ${label}`),
  };
}
