// Google rating and reviews. One implementation, used at build time (so the
// rating chip, review wall and aggregateRating schema are in the static HTML)
// and by /api/reviews/ at request time (so the chip refreshes between deploys).
//
// The Places key never reaches the client. Without a key, or when the API
// fails, the fallback is the last value Ricardo confirmed in business.json:
// never "0 reviews", and never invented review text.
import business from '@/data/business.json';

export interface Review {
  /** First name only. */
  author: string;
  rating: number;
  text: string;
  /** ISO date the review was published. */
  date: string | null;
}
export interface ReviewsData {
  rating: number;
  count: number;
  source: 'live' | 'fallback';
  reviews: Review[];
}

export const FALLBACK: ReviewsData = {
  rating: business.reviews.fallbackRating,
  count: business.reviews.fallbackCount,
  source: 'fallback',
  reviews: [],
};

function env(name: string): string | undefined {
  const fromProcess = typeof process !== 'undefined' ? process.env?.[name] : undefined;
  return fromProcess || (import.meta.env?.[name] as string | undefined) || undefined;
}

export async function fetchReviews(): Promise<ReviewsData> {
  const key = env('GOOGLE_PLACES_KEY');
  const placeId = env('GBP_PLACE_ID');
  if (!key || !placeId) return FALLBACK;
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
      headers: {
        'X-Goog-Api-Key': key,
        'X-Goog-FieldMask': 'rating,userRatingCount,reviews',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error('[reviews] Places API returned', res.status);
      return FALLBACK;
    }
    const data = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      reviews?: {
        rating?: number;
        text?: { text?: string };
        originalText?: { text?: string };
        authorAttribution?: { displayName?: string };
        publishTime?: string;
      }[];
    };
    if (!data.rating || !data.userRatingCount) return FALLBACK;
    return {
      rating: data.rating,
      count: data.userRatingCount,
      source: 'live',
      reviews: (data.reviews ?? [])
        .map((r) => ({
          author: (r.authorAttribution?.displayName ?? '').trim().split(/\s+/)[0] ?? '',
          rating: r.rating ?? 0,
          // Verbatim. Never paraphrased, never trimmed mid-word by us.
          text: (r.originalText?.text ?? r.text?.text ?? '').trim(),
          date: r.publishTime ?? null,
        }))
        .filter((r) => r.text && r.author),
    };
  } catch (err) {
    console.error('[reviews] Places API error:', (err as Error).message);
    return FALLBACK;
  }
}

// One fetch per build, shared by every page.
let cached: Promise<ReviewsData> | null = null;
export function getReviews(): Promise<ReviewsData> {
  cached ??= fetchReviews();
  return cached;
}

export const ratingText = (rating: number) => rating.toFixed(1);
