// sitemap.xml, generated at build from the route registry (src/data/nav.ts)
// and the case studies. noindex pages are left out. lastmod is the last git
// commit that touched the page's sources: never filesystem mtime, never a
// typed-in date. A file git has never seen gets no lastmod at all.
import type { APIRoute } from 'astro';
import { execFileSync } from 'node:child_process';
import { routes } from '@/data/nav';
import { caseStudies } from '@/data/projects';
import { rebase } from '@/lib/site';

function lastmod(sources: string[]): string | null {
  const dates = sources
    .map((file) => {
      try {
        return execFileSync('git', ['log', '-1', '--format=%cI', '--', file], { encoding: 'utf8' }).trim();
      } catch {
        return '';
      }
    })
    .filter(Boolean)
    .sort();
  const latest = dates[dates.length - 1];
  if (!latest) return null;
  const today = new Date().toISOString().slice(0, 10);
  const day = latest.slice(0, 10);
  return day > today ? today : day;
}

export const GET: APIRoute = () => {
  const entries = [
    ...routes.filter((r) => !r.noindex).map((r) => ({ path: r.path, sources: r.sources })),
    ...caseStudies.map((c) => ({ path: `/projects/${c.slug}/`, sources: ['src/data/projects.ts'] })),
  ];
  const urls = entries
    .map(({ path, sources }) => {
      const mod = lastmod(sources);
      return `  <url>\n    <loc>${rebase(path)}</loc>${mod ? `\n    <lastmod>${mod}</lastmod>` : ''}\n  </url>`;
    })
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
