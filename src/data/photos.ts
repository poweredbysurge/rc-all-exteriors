// Photo registry. Components reference photos by key, so swapping a select for
// its Drive original is one import here.
//
// Captions name the job type from the Drive folder name only. The town is
// never guessed: it renders as a CONFIRM slot until Ricardo supplies it
// (design/DESIGN-DEBT.md, "Photo gaps").
import type { ImageMetadata } from 'astro';
import colonial from '@/assets/photos/rc-select-01-hero-gbp-cover.jpg';
import twoStory from '@/assets/photos/rc-select-02-two-story-front.jpg';
import underlayment from '@/assets/photos/rc-select-03-underlayment.jpg';
import mansard from '@/assets/photos/rc-select-04-mansard-yard-sign.jpg';
import flat from '@/assets/photos/rc-select-05-flat-roof-membrane.jpg';

export interface Photo {
  src: ImageMetadata;
  alt: string;
  caption: string;
  /** Job type used by the projects gallery filter. */
  job: string;
  /** object-position for cover crops. */
  position: string;
  /** Town, once Ricardo confirms it. Null renders the CONFIRM slot. */
  town: string | null;
}

export const photos = {
  colonial: {
    src: colonial,
    alt: 'New gray architectural shingle roof on a tan colonial home, a roof replacement by RC All Exteriors',
    caption: 'Shingle roof replacement, colonial home',
    job: 'Roof replacement',
    position: 'center 40%',
    town: null,
  },
  twoStory: {
    src: twoStory,
    alt: 'New gray-brown shingle roof on a two-story home, a roof replacement by RC All Exteriors',
    caption: 'Shingle roof replacement, two-story home',
    job: 'Roof replacement',
    position: 'center',
    town: null,
  },
  underlayment: {
    src: underlayment,
    alt: 'Roof replacement in progress: old shingles removed and new underlayment going down',
    caption: 'Roof replacement in progress, underlayment',
    job: 'Roof replacement',
    position: 'center',
    town: null,
  },
  mansard: {
    src: mansard,
    alt: 'Mansard roof replacement on a brick townhouse, with an RC All Exteriors yard sign out front',
    caption: 'Mansard roof replacement, brick townhouse',
    job: 'Roof replacement',
    position: 'center',
    town: null,
  },
  flat: {
    src: flat,
    alt: 'White membrane flat roof installed by RC All Exteriors',
    caption: 'Flat roof, white membrane',
    job: 'Commercial',
    position: 'center',
    town: null,
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

// The LCP element per route (master prompt section 13). Base.astro preloads
// this image and Hero.astro renders it, both from this one map, so the preload
// can never point at a different file than the hero. 'text' means the page has
// no hero photo and its LCP is the H1, which the font preload covers.
export const LCP_MAP: Record<string, PhotoKey | 'text'> = {
  '/': 'colonial',
  '/roof-replacement/': 'twoStory',
  '/roof-repair/': 'underlayment',
  '/storm-damage-roof-repair/': 'colonial',
  '/emergency-roof-repair/': 'underlayment',
  '/free-roof-inspection/': 'mansard',
  '/certainteed-roofing/': 'colonial',
  '/metal-roofing/': 'twoStory',
  '/commercial-roofing/': 'flat',
  '/skylights/': 'twoStory',
  '/windows-doors/': 'mansard',
  '/gutters/': 'colonial',
  '/siding/': 'mansard',
  '/service-areas/fairfax-va/': 'colonial',
  '/service-areas/springfield-va/': 'twoStory',
  '/service-areas/lorton-va/': 'mansard',
  '/services/': 'text',
  '/service-areas/': 'text',
  '/warranty/': 'text',
  '/financing/': 'text',
  '/about/': 'text',
  '/contact/': 'text',
  '/reviews/': 'text',
  '/projects/': 'text',
  '/privacy-policy/': 'text',
  '/terms/': 'text',
  '/sms-terms/': 'text',
  '/thank-you/': 'text',
  '/404/': 'text',
};
