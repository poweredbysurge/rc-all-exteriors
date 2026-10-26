// Photo registry. Components reference photos by key, so swapping a select for
// its Drive original is one import here.
//
// Captions name the job type from the Drive folder name only. The town is
// never guessed: it renders as a CONFIRM slot until Ricardo supplies it
// (design/DESIGN-DEBT.md, "Photo gaps").
import type { ImageMetadata } from 'astro';
import twoStory from '@/assets/photos/rc-select-02-two-story-front.jpg';
import underlayment from '@/assets/photos/rc-select-03-underlayment.jpg';
import mansard from '@/assets/photos/rc-select-04-mansard-yard-sign.jpg';
import flat from '@/assets/photos/rc-select-05-flat-roof-membrane.jpg';
// 2026-10-19: originals from Ricardo's phone, sorted on Sam's Mac (MANIFEST.csv there).
import colonial from '@/assets/photos/rc-colonial-street.jpg';
import colonialHero from '@/assets/photos/rc-colonial-street-hero.jpg';
import colonialFront from '@/assets/photos/rc-colonial-front-porch.jpg';
import colonialGarage from '@/assets/photos/rc-colonial-garage-truck.jpg';
import colonialChimney from '@/assets/photos/rc-colonial-chimney-side.jpg';
import tanRidge from '@/assets/photos/rc-tan-townhouse-ridge-aerial.jpg';
import flatTpo from '@/assets/photos/rc-flat-tpo-membrane.jpg';
import proFlatRoof from '@/assets/photos/rc-ricardo-flat-roof.jpg';
import proOnRoof from '@/assets/photos/rc-ricardo-on-roof.jpg';
import proYardSign from '@/assets/photos/rc-ricardo-front-yard-sign.jpg';
import redRidge from '@/assets/photos/rc-red-shingle-ridge-aerial.jpg';
import twoStoryWalk from '@/assets/photos/rc-two-story-front-walkway.jpg';
import newVsOld1 from '@/assets/photos/rc-new-roof-next-to-old-01.jpg';
import newVsOld2 from '@/assets/photos/rc-new-roof-next-to-old-02.jpg';
import crewRopes from '@/assets/photos/rc-crew-ropes.jpg';
import crewRidgeCap from '@/assets/photos/rc-crew-ridge-cap.jpg';
import crewSelfie from '@/assets/photos/rc-crew-selfie.jpg';
import underlaymentYardSign from '@/assets/photos/rc-underlayment-crew-yard-sign.jpg';
import underlaymentCertainteed from '@/assets/photos/rc-underlayment-certainteed.jpg';
import newDecking from '@/assets/photos/rc-new-decking.jpg';
import deckingCrew from '@/assets/photos/rc-decking-crew.jpg';
import shakeInstall from '@/assets/photos/rc-shake-shingle-install.jpg';
import mansardShakeFront from '@/assets/photos/rc-mansard-shake-front.jpg';
import mansardShakeYardSign from '@/assets/photos/rc-mansard-shake-front-yard-sign.jpg';
import mansardBrownYardSign from '@/assets/photos/rc-mansard-brown-corner-yard-sign.jpg';
import chimneyFlashing from '@/assets/photos/rc-chimney-flashing.jpg';

export interface Photo {
  src: ImageMetadata;
  alt: string;
  caption: string;
  /** Job type used by the projects gallery filter. */
  job: string;
  /** object-position for CSS cover crops (hero, service cards). */
  position: string;
  /**
   * Where the image service anchors a cropped derivative. Sharp only takes
   * keywords here, and the default 'centre' cuts through a standing person at
   * the chest in a landscape frame. Every photo with a person in it names
   * 'top' (or whichever edge the faces are nearest) so no crop ratio can take
   * a head off (master prompt v1.4 section 13).
   */
  focus?: 'top' | 'bottom' | 'left' | 'right';
  /**
   * A pre-cut 16:9 file for the desktop hero band. The image service only
   * takes keyword positions, so a portrait source would otherwise be cropped
   * through its middle (siding, not roof). The portrait stays for the 3:4
   * mobile crop.
   */
  heroSrc?: ImageMetadata;
  /** Town, once Ricardo confirms it. Null renders the CONFIRM slot. */
  town: string | null;
  /** False keeps a process or people shot out of the opening-photo pool (src/lib/rhythm.ts). */
  pool?: boolean;
  /** False keeps a photo out of the projects gallery (a before photo is not finished work). */
  gallery?: boolean;
}

export const photos = {
  colonial: {
    src: colonial,
    alt: 'New gray architectural shingle roof on a tan colonial home, seen from the street, a roof replacement by RC All Exteriors',
    caption: 'Shingle roof replacement, colonial home',
    job: 'Roof replacement',
    position: 'center 28%',
    heroSrc: colonialHero,
    town: null,
  },
  colonialFront: {
    src: colonialFront,
    alt: 'Front of a tan colonial home with a new gray architectural shingle roof and a covered porch',
    caption: 'Shingle roof replacement, colonial home, front',
    job: 'Roof replacement',
    position: 'center 35%',
    town: null,
  },
  colonialGarage: {
    src: colonialGarage,
    alt: 'Detached garage with a new gray shingle roof beside a white pickup truck',
    caption: 'Shingle roof replacement, garage',
    job: 'Roof replacement',
    position: 'center',
    town: null,
  },
  colonialChimney: {
    src: colonialChimney,
    alt: 'Side of a colonial home with a new gray shingle roof and brick chimney',
    caption: 'Shingle roof replacement, chimney side',
    job: 'Roof replacement',
    position: 'center 35%',
    town: null,
  },
  tanRidge: {
    src: tanRidge,
    alt: 'New tan architectural shingle roof on a brick townhouse, looking down the ridge',
    caption: 'Shingle roof replacement, townhouse',
    job: 'Roof replacement',
    position: 'center',
    town: null,
  },
  flatTpo: {
    src: flatTpo,
    alt: 'New white TPO membrane on a flat roof with a drain, installed by RC All Exteriors',
    caption: 'Flat roof, white TPO membrane',
    job: 'Commercial',
    position: 'center 60%',
    town: null,
  },
  proFlatRoof: {
    src: proFlatRoof,
    alt: 'An RC All Exteriors professional on the roof during a flat roof installation',
    caption: 'On site, flat roof installation',
    job: 'Commercial',
    position: 'center 30%',
    focus: 'top',
    town: null,
    pool: false,
  },
  // Ricardo (Sam, 2026-10-23). Owner-adjacent slots use this one: About hero,
  // homepage Why us, inspection page. Still unnamed in the caption and alt.
  proOnRoof: {
    src: proOnRoof,
    alt: 'An RC All Exteriors professional walking a shingle roof during an inspection',
    caption: 'On the roof, inspection in progress',
    job: 'Roof replacement',
    position: 'center 30%',
    focus: 'top',
    town: null,
    pool: false,
  },
  // The person here is Ricardo's brother-in-law (Sam, 2026-10-23): fine in a
  // process row or a city page, never the About hero or beside the owner copy.
  proYardSign: {
    src: proYardSign,
    alt: 'An RC All Exteriors professional in front of a brick home with its new Brava synthetic shake mansard roof and the RC All Exteriors yard sign',
    caption: 'Finished Brava shake mansard roof, with the sign out front',
    job: 'Roof replacement',
    position: 'center 40%',
    focus: 'top',
    town: null,
    pool: false,
  },
  // A before photo (Sam, 2026-10-23): faded ridge cap, granule loss. It was
  // captioned as a finished replacement and used as the metal roofing hero.
  // Kept for a future case study's before-and-after; nowhere else.
  redRidge: {
    src: redRidge,
    alt: 'Worn red three-tab shingle roof with a faded ridge cap, photographed from the ridge before replacement',
    caption: 'Before: a worn red shingle roof at inspection',
    job: 'Roof replacement',
    position: 'center',
    town: null,
    pool: false,
    gallery: false,
  },
  twoStoryWalk: {
    src: twoStoryWalk,
    alt: 'Front walkway of a brick two-story home with a new gray shingle roof',
    caption: 'Shingle roof replacement, two-story home, front',
    job: 'Roof replacement',
    position: 'center 40%',
    town: null,
  },
  newVsOld1: {
    src: newVsOld1,
    alt: 'New light gray shingle roof on a townhouse beside the neighbor\'s worn brown roof',
    caption: 'New roof beside the old one, townhouse',
    job: 'Roof replacement',
    position: 'center',
    town: null,
    pool: false,
  },
  newVsOld2: {
    src: newVsOld2,
    alt: 'New light gray shingles meeting the neighbor\'s old brown shingles at the party wall',
    caption: 'New roof beside the old one, townhouse',
    job: 'Roof replacement',
    position: 'center',
    town: null,
    pool: false,
  },
  crewRopes: {
    src: crewRopes,
    alt: 'RC All Exteriors crew tied off with safety lines while installing ridge cap on a townhouse',
    caption: 'Crew on the ridge, safety lines on',
    job: 'Roof replacement',
    position: 'center 40%',
    focus: 'top',
    town: null,
    pool: false,
  },
  crewRidgeCap: {
    src: crewRidgeCap,
    alt: 'Two RC All Exteriors roofers nailing ridge cap shingles on a townhouse roof',
    caption: 'Installing ridge cap',
    job: 'Roof replacement',
    position: 'center 30%',
    focus: 'top',
    town: null,
    pool: false,
  },
  crewSelfie: {
    src: crewSelfie,
    alt: 'Two RC All Exteriors crew members in company shirts at a finished job',
    caption: 'The RC All Exteriors crew',
    job: 'Roof replacement',
    position: 'center 30%',
    focus: 'top',
    town: null,
    pool: false,
  },
  underlaymentYardSign: {
    src: underlaymentYardSign,
    alt: 'Brick home under CertainTeed underlayment with the crew unloading materials and the RC All Exteriors yard sign out front',
    caption: 'Mansard roof replacement in progress, CertainTeed underlayment down and materials arriving',
    job: 'Roof replacement',
    position: 'center 45%',
    focus: 'bottom',
    town: null,
    pool: false,
  },
  underlaymentCertainteed: {
    src: underlaymentCertainteed,
    alt: 'CertainTeed RoofRunner synthetic underlayment laid over new decking on a townhouse roof',
    caption: 'CertainTeed underlayment going down',
    job: 'Roof replacement',
    position: 'center',
    town: null,
    pool: false,
  },
  newDecking: {
    src: newDecking,
    alt: 'New plywood decking replacing rotted sheets on a roof before underlayment',
    caption: 'Rotted decking replaced before the new roof goes on, up to five sheets included',
    job: 'Roof replacement',
    position: 'center',
    town: null,
    pool: false,
  },
  deckingCrew: {
    src: deckingCrew,
    alt: 'Roofer fitting new plywood decking on a roof',
    caption: 'Replacing decking',
    job: 'Roof replacement',
    position: 'center 40%',
    focus: 'top',
    town: null,
    pool: false,
  },
  shakeInstall: {
    src: shakeInstall,
    alt: 'Roofer installing Brava synthetic shake on a mansard roof',
    caption: 'Brava synthetic shake going on, mansard roof replacement',
    job: 'Roof replacement',
    position: 'center',
    focus: 'bottom',
    town: null,
    pool: false,
  },
  mansardShakeFront: {
    src: mansardShakeFront,
    alt: 'Brick home with a new Brava synthetic shake mansard roof',
    caption: 'Mansard roof replacement, Brava synthetic shake',
    job: 'Roof replacement',
    position: 'center 40%',
    town: null,
  },
  mansardShakeYardSign: {
    src: mansardShakeYardSign,
    alt: 'Brick home with a new Brava synthetic shake mansard roof and the RC All Exteriors yard sign by the azaleas',
    caption: 'Mansard roof replacement, Brava synthetic shake, finished',
    job: 'Roof replacement',
    position: 'center 45%',
    town: null,
  },
  mansardBrownYardSign: {
    src: mansardBrownYardSign,
    alt: 'Brick townhouse with a new dark brown mansard roof and the RC All Exteriors yard sign',
    caption: 'Mansard roof replacement, brick townhouse',
    job: 'Roof replacement',
    position: 'center 40%',
    town: null,
  },
  chimneyFlashing: {
    src: chimneyFlashing,
    alt: 'New step flashing and counter flashing where a brick chimney meets light gray shingles',
    caption: 'Chimney flashing on a finished roof',
    job: 'Roof repair',
    position: 'center',
    town: null,
    pool: false,
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
  '/roof-repair/': 'tanRidge',
  '/storm-damage-roof-repair/': 'twoStoryWalk',
  '/emergency-roof-repair/': 'underlayment',
  '/free-roof-inspection/': 'mansardShakeYardSign',
  '/certainteed-roofing/': 'colonialFront',
  '/metal-roofing/': 'tanRidge',
  '/commercial-roofing/': 'flatTpo',
  '/skylights/': 'twoStory',
  '/windows-doors/': 'mansard',
  '/gutters/': 'colonialChimney',
  '/siding/': 'mansardShakeFront',
  '/service-areas/fairfax-va/': 'colonialFront',
  '/service-areas/springfield-va/': 'twoStory',
  '/service-areas/lorton-va/': 'mansardBrownYardSign',
  '/service-areas/alexandria-va/': 'tanRidge',
  // Guides open on a text hero; the H1 is the LCP (ADR-018).
  '/guides/': 'text',
  '/guides/does-insurance-cover-roof-replacement/': 'text',
  '/guides/certainteed-landmark-shingles/': 'text',
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
