// Image pipeline helpers. Originals live in src/assets/photos; Astro's sharp
// service emits AVIF and WebP derivatives at build. No JPG or PNG reaches the
// output (check-integrity enforces it).
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { photos, type PhotoKey } from '@/data/photos';

export interface SourceSet {
  avif: string;
  webp: string;
  /** Largest WebP, used as the <img src> fallback. */
  src: string;
  width: number;
  height: number;
}

interface Crop {
  /** width / height. Omit to keep the source ratio. */
  ratio?: number;
  /** Sharp crop anchor keyword ('top', 'bottom', ...). Photos with people set one in photos.ts (`focus`). */
  position?: string;
}

async function one(src: ImageMetadata, width: number, format: 'avif' | 'webp', crop: Crop) {
  const height = crop.ratio ? Math.round(width / crop.ratio) : undefined;
  return getImage({
    src,
    width,
    ...(height ? { height, fit: 'cover' as const, position: crop.position ?? 'center' } : {}),
    format,
    quality: format === 'avif' ? 52 : 72,
  });
}

/** srcset strings in AVIF and WebP for a set of widths, never upscaling past the source. */
export async function sourceSet(src: ImageMetadata, widths: number[], crop: Crop = {}): Promise<SourceSet> {
  // With a crop the limiting dimension can be the height.
  const maxWidth = crop.ratio ? Math.min(src.width, Math.floor(src.height * crop.ratio)) : src.width;
  const usable = [...new Set(widths.map((w) => Math.min(w, maxWidth)))].sort((a, b) => a - b);
  const [avif, webp] = await Promise.all(
    (['avif', 'webp'] as const).map((format) => Promise.all(usable.map((w) => one(src, w, format, crop)))),
  );
  const largest = usable[usable.length - 1];
  return {
    avif: avif.map((img, i) => `${img.src} ${usable[i]}w`).join(', '),
    webp: webp.map((img, i) => `${img.src} ${usable[i]}w`).join(', '),
    src: webp[webp.length - 1].src,
    width: largest,
    height: crop.ratio ? Math.round(largest / crop.ratio) : Math.round((largest * src.height) / src.width),
  };
}

/**
 * A reviewer's Google profile photo as a local 72px WebP (36px at 2x), or
 * null when Google's URL cannot be fetched at build. The card then shows the
 * reviewer's initial instead. Never an external request on the live page.
 */
export async function avatar(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  try {
    const img = await getImage({ src: url, width: 72, height: 72, fit: 'cover', format: 'webp', quality: 80, inferSize: true });
    return img.src;
  } catch (err) {
    console.warn('[reviews] avatar skipped:', (err as Error).message);
    return null;
  }
}

// Hero art direction. Phones get a 3:4 portrait crop sized to the viewport
// width, so a tall stacked hero never has to stretch a landscape file across
// 2,000px of height. The photo sits behind the headline and fades into the
// dark surface, where the lead card takes over. From 1024px the hero is a
// wide 16:9 band.
// The switch is at 1024px, where the hero becomes two columns.
export const HERO_MOBILE_MEDIA = '(max-width: 1023px)';
export const HERO_DESKTOP_MEDIA = '(min-width: 1024px)';
const HERO_MOBILE_WIDTHS = [480, 640, 828, 1080];
const HERO_DESKTOP_WIDTHS = [1200, 1440, 1920];

export async function heroSources(key: PhotoKey) {
  const photo = photos[key];
  const [mobile, desktop] = await Promise.all([
    sourceSet(photo.src, HERO_MOBILE_WIDTHS, { ratio: 3 / 4 }),
    sourceSet(photo.heroSrc ?? photo.src, HERO_DESKTOP_WIDTHS, { ratio: 16 / 9 }),
  ]);
  return { photo, mobile, desktop };
}
