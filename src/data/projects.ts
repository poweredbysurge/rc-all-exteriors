// Case studies. Every field comes from a real job and Ricardo's own notes
// (batch-5 section 5 rule): no composite or made-up projects. The list is
// empty until he sends the four launch jobs; adding an entry here publishes
// /projects/<slug>/ from the template in src/pages/projects/[slug].astro.
import type { PhotoKey } from '@/data/photos';

export interface CaseStudy {
  /** <town>-<job-type>, for example "lorton-roof-replacement". */
  slug: string;
  jobType: string;
  town: string;
  summary: string;
  homeType: string;
  materials: string;
  timeline: string;
  insuranceClaim: boolean;
  found: string;
  did: string;
  result: string;
  before: PhotoKey;
  after: PhotoKey;
  /** The matching service page and, where one exists, city page. */
  serviceHref: string;
  cityHref: string | null;
  /** The customer's Google review, verbatim, only if they agreed to be featured. */
  review: { author: string; text: string; date: string | null } | null;
}

export const caseStudies: CaseStudy[] = [];
