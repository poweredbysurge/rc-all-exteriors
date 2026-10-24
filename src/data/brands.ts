// Brands the company installs and credentials it holds, for the logo strip
// under the homepage hero (master prompt section 12). Every entry is a real
// relationship Ricardo confirmed (ADR-007): never a logo for a product the
// crew has not installed. Files are the brands' own marks, from their sites
// or the HomeSource repo (2026-10-23); nothing redrawn.
import type { ImageMetadata } from 'astro';
import certainteed from '@/assets/brands/certainteed.png';
import jamesHardie from '@/assets/brands/james-hardie.png';
import provia from '@/assets/brands/provia.png';
import brava from '@/assets/brands/brava.svg?raw';
import velux from '@/assets/brands/velux.svg?raw';
import bbb from '@/assets/brands/bbb.svg?raw';
import enhancify from '@/assets/brands/enhancify.svg?raw';

export interface Brand {
  name: string;
  /** What the logo stands for on this site, for the alt text and the title. */
  claim: string;
  /** Where the logo links: the page about that product or credential. */
  href: string;
  /** Raster mark through the image pipeline, or an inline SVG string. */
  image?: ImageMetadata;
  svg?: string;
  /** Rendered height in px on desktop; marks vary a lot in proportion. */
  height: number;
}

export const brands: Brand[] = [
  { name: 'CertainTeed', claim: 'CertainTeed shingle installer', href: '/certainteed-roofing/', image: certainteed, height: 26 },
  { name: 'Brava', claim: 'Certified Brava synthetic shake, slate and tile installer', href: '/roof-replacement/', svg: brava.replace(/fill="#FFF"/g, 'fill="currentColor"'), height: 40 },
  { name: 'Better Business Bureau', claim: 'BBB Accredited Business', href: '/about/', svg: bbb, height: 40 },
  { name: 'James Hardie', claim: 'James Hardie fiber cement siding', href: '/siding/', image: jamesHardie, height: 30 },
  { name: 'ProVia', claim: 'ProVia windows and doors', href: '/windows-doors/', image: provia, height: 40 },
  { name: 'VELUX', claim: 'VELUX skylights', href: '/skylights/', svg: velux, height: 26 },
  { name: 'Enhancify', claim: 'Financing through Enhancify', href: '/financing/', svg: enhancify, height: 20 },
];
