// Surface rhythm and photo placement for pages laid out from copy sections
// (master prompt v1.3 section 5, ADR-006).
//
// Every inner page gets the two things the homepage got on 2026-10-19:
//   1. a real job photo beside the first body section, so the page is not
//      1,700 words with one picture at the top
//   2. one dark band in the first half of the body, never touching the CTA
//      band, so the page alternates like the old site did instead of running
//      light from the hero to the footer
// The light bands still cycle white, tint, white, tint around it.
import { photos, type PhotoKey } from '@/data/photos';
import { kindOf } from '@/lib/blocks';
import type { Section } from '@/lib/copy';

export type Surface = 'surface' | 'muted' | 'subtle' | 'contrast';

export interface Plan {
  bg: Surface;
  /** A photo for this section's first-section split, or none. */
  photo: PhotoKey | null;
}

const CYCLE: Surface[] = ['surface', 'muted', 'surface', 'subtle'];
const KEYS = Object.keys(photos) as PhotoKey[];

function hash(s: string): number {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

/**
 * The first photo in the registry that is not the page's hero photo, rotated
 * by route so sibling pages do not all open on the same picture.
 */
export function companionPhoto(route: string, exclude: PhotoKey | 'text' | null, job = 'Roof replacement'): PhotoKey {
  // Only photos of the page's own job type: a flat membrane beside a shingle
  // replacement intro reads wrong. Residential pages all draw from the
  // replacement set, the only finished-house photos we have.
  const typed = KEYS.filter((k) => photos[k].job === job && photos[k].pool !== false && k !== exclude);
  const pool = typed.length ? typed : KEYS.filter((k) => photos[k].pool !== false && k !== exclude);
  return pool[hash(route) % pool.length];
}

export interface Rhythm {
  plans: Plan[];
  /** Index of the dark body section, if the page is long enough to hold one. */
  dark: number | null;
  /** True when the CTA band would sit within one band of the dark section and belongs after the FAQ instead. */
  bandAfterFaq: boolean;
}

export function planRhythm(
  body: Section[],
  opts: {
    route: string;
    heroPhoto: PhotoKey | 'text' | null;
    /** Index of the body section the CTA band naturally follows, or -1 when the band sits after the tail. */
    bandAfter: number;
    /** Light bands after the body and before the closing CTA band (the FAQ counts as one). */
    tailLights?: number;
    /** Where the light cycle starts, when a band precedes the body. */
    offset?: number;
    firstPhoto?: boolean;
    /** Job type for the opening photo (photos.ts `job`). */
    job?: string;
    avoid?: number[];
  },
): Rhythm {
  const kinds = body.map(kindOf);
  const offset = opts.offset ?? 0;
  const tail = opts.tailLights ?? 0;
  const plans: Plan[] = body.map((_, i) => ({ bg: CYCLE[(i + offset) % CYCLE.length], photo: null }));

  // The dark band: in the first half of the body, never the opening section
  // (it carries the photo), never a section with an attached sub-band, and
  // always with at least two light bands between it and the closing CTA band.
  // An icon-block grid first, then a split, then the process steps (photos on
  // the dark surface). Pages too short to hold one keep the light cycle.
  let dark: number | null = null;
  if (body.length >= 3) {
    const half = Math.ceil(body.length / 2);
    const avoid = opts.avoid ?? [];
    const candidates = [...Array(body.length).keys()].filter(
      (i) => i >= 1 && i <= half && !avoid.includes(i) && body.length - 1 - i + tail >= 2,
    );
    for (const kind of ['h3grid', 'split', 'steps'] as const) {
      const hit = candidates.find((i) => kinds[i] === kind);
      if (hit !== undefined) {
        dark = hit;
        break;
      }
    }
    if (dark !== null) {
      plans[dark].bg = 'contrast';
      // Re-seat the light cycle after it so no two identical bands touch.
      for (let i = dark + 1; i < body.length; i++) plans[i].bg = CYCLE[(i - dark - 1) % CYCLE.length];
    }
  }

  // The photo: beside the first section when it is prose or a split.
  if (opts.firstPhoto !== false && body.length && (kinds[0] === 'prose' || kinds[0] === 'split')) {
    plans[0].photo = companionPhoto(opts.route, opts.heroPhoto, opts.job);
  }

  // When the CTA band's natural spot (after the process section) is within one
  // band of the dark section, it moves below the FAQ.
  const bandAfterFaq = dark !== null && opts.bandAfter >= 0 && Math.abs(opts.bandAfter - dark) <= 1;
  return { plans, dark, bandAfterFaq };
}

/** The light surface that follows the last body band, for the FAQ. */
export function faqSurface(plans: Plan[]): Exclude<Surface, 'contrast'> {
  const last = plans.at(-1)?.bg;
  return last === 'surface' ? 'muted' : last === 'contrast' ? 'surface' : 'surface';
}
