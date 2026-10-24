// Lead emails on the RC design tokens (ADR-012). Table-based HTML, inline
// styles, system sans (mail clients do not load web fonts), the white lockup
// as a PNG served from the site, 600px wide, one column. Colors come from the
// generated theme so a token change here is a token change there. Two
// messages: the internal notification (the one that has to land, with tap
// targets to call, text and email the lead) and the homeowner confirmation.
import business from '@/data/business.json';
import theme from '@/styles/theme.generated.css?raw';
import { SITE } from '@/lib/site';

const token = (name: string): string => {
  const hit = theme.match(new RegExp(`--color-${name}:\\s*(#[0-9A-Fa-f]{6})`));
  if (!hit) throw new Error(`theme has no --color-${name}`);
  return hit[1];
};
export const C = {
  dark: token('surface-contrast'),
  accent: token('accent'),
  accentTint: token('accent-tint'),
  surface: token('surface'),
  muted: token('surface-muted'),
  fg: token('fg'),
  fgMuted: token('fg-muted'),
  fgSubtle: token('fg-subtle'),
  inverseMuted: token('fg-inverse-muted'),
  border: token('border-subtle'),
  star: token('star'),
};
const FONT = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;

export const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** A bulletproof button: a table cell with the color, the link filling it. */
export function button(href: string, label: string, variant: 'primary' | 'secondary' = 'primary'): string {
  const bg = variant === 'primary' ? C.accent : C.surface;
  const fg = variant === 'primary' ? '#FFFFFF' : C.accent;
  const border = variant === 'primary' ? C.accent : C.border;
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="display:inline-table;margin:0 8px 8px 0"><tr><td align="center" bgcolor="${bg}" style="border-radius:8px;border:1px solid ${border}"><a href="${esc(href)}" style="display:inline-block;padding:13px 20px;font-family:${FONT};font-size:15px;font-weight:700;line-height:18px;color:${fg};text-decoration:none;border-radius:8px">${esc(label)}</a></td></tr></table>`;
}

/** A label and value row for the details table. */
export function row(label: string, value: string): string {
  return `<tr><td style="padding:10px 16px 10px 0;font-family:${FONT};font-size:13px;line-height:18px;color:${C.fgSubtle};vertical-align:top;white-space:nowrap;border-top:1px solid ${C.border}">${esc(label)}</td><td style="padding:10px 0;font-family:${FONT};font-size:15px;line-height:22px;color:${C.fg};vertical-align:top;border-top:1px solid ${C.border}">${esc(value).replace(/\n/g, '<br>')}</td></tr>`;
}

export function chip(text: string, tone: 'accent' | 'dark' = 'accent'): string {
  const bg = tone === 'accent' ? C.accentTint : C.dark;
  const fg = tone === 'accent' ? C.accent : '#FFFFFF';
  return `<span style="display:inline-block;padding:4px 10px;border-radius:999px;background:${bg};color:${fg};font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;line-height:16px">${esc(text)}</span>`;
}

/**
 * The frame every lead email shares: dark header with the lockup, white card,
 * muted footer with the business line. `preheader` is the inbox preview text.
 */
export function layout(opts: { preheader: string; header?: string; body: string; footer?: string }): string {
  const logo = `${SITE}/email/logo-white.png`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(business.name)}</title></head>
<body style="margin:0;padding:0;background:${C.muted}">
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(opts.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${C.muted}"><tr><td align="center" style="padding:24px 12px">
<table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px">
  <tr><td bgcolor="${C.dark}" style="background:${C.dark};border-radius:14px 14px 0 0;padding:22px 28px">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
      <td style="vertical-align:middle"><img src="${logo}" alt="${esc(business.name)}" width="120" height="57" style="display:block;width:120px;height:auto;border:0"></td>
      <td align="right" style="vertical-align:middle;font-family:${FONT};font-size:13px;line-height:18px;color:${C.inverseMuted}">${opts.header ?? ''}</td>
    </tr></table>
  </td></tr>
  <tr><td bgcolor="${C.surface}" style="background:${C.surface};padding:28px 28px 20px;border-left:1px solid ${C.border};border-right:1px solid ${C.border}">${opts.body}</td></tr>
  <tr><td bgcolor="${C.surface}" style="background:${C.surface};border-radius:0 0 14px 14px;border:1px solid ${C.border};border-top:1px solid ${C.border};padding:16px 28px;font-family:${FONT};font-size:12px;line-height:18px;color:${C.fgSubtle}">${opts.footer ?? `${esc(business.name)} · ${esc(business.serviceAreaLine)} · ${esc(business.phone.display)} · ${esc(business.hours.display)}`}</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

export const h = {
  eyebrow: (t: string) => `<p style="margin:0 0 6px;font-family:${FONT};font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.accent}">${esc(t)}</p>`,
  title: (t: string) => `<h1 style="margin:0 0 6px;font-family:${FONT};font-size:26px;line-height:32px;font-weight:800;letter-spacing:-0.01em;color:${C.fg}">${esc(t)}</h1>`,
  lead: (t: string) => `<p style="margin:0 0 18px;font-family:${FONT};font-size:16px;line-height:24px;color:${C.fgMuted}">${t}</p>`,
  p: (t: string) => `<p style="margin:0 0 14px;font-family:${FONT};font-size:16px;line-height:25px;color:${C.fg}">${t}</p>`,
  small: (t: string) => `<p style="margin:14px 0 0;font-family:${FONT};font-size:12px;line-height:18px;color:${C.fgSubtle}">${t}</p>`,
  table: (rows: string) => `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:6px 0 4px;border-bottom:1px solid ${C.border}">${rows}</table>`,
  stars: () => `<span style="color:${C.star};font-size:14px;letter-spacing:1px">&#9733;&#9733;&#9733;&#9733;&#9733;</span>`,
};
