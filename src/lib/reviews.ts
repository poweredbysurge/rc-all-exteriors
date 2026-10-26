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
  /** The reviewer's Google profile photo, when Google supplies one. */
  photo?: string | null;
  /** The review itself on Google Maps, so the card can link to the real thing. */
  url?: string | null;
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
  // REVIEWS_MOCK=path/to/places-response.json renders the wall from a saved
  // Places response, for layout checks without a key. Never set on Vercel.
  const mock = env('REVIEWS_MOCK');
  if (!mock && (!key || !placeId)) return FALLBACK;
  try {
    const res = mock
      ? new Response(await (await import('node:fs/promises')).readFile(mock, 'utf8'))
      : await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`, {
          headers: {
            'X-Goog-Api-Key': key!,
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
        authorAttribution?: { displayName?: string; photoUri?: string; uri?: string };
        publishTime?: string;
        googleMapsUri?: string;
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
          photo: r.authorAttribution?.photoUri ?? null,
          url: r.googleMapsUri ?? null,
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

// A fixed quote in the copy's [REVIEW] slot (ADR-017):
//   "Verbatim sentence." Full Name, Google review, Month Year
// The text is a real review, quoted word for word by the copy owner. When the
// live review containing that sentence is in the proxy response, the card takes
// its stars, photo and Google link; without it (no Places key, or the review
// has rotated out of Google's five) the card renders from the copy alone, at
// five stars (each quote is checked against the live review before it ships).
const QUOTE_RE = /^"(.+)"\s+(.+?), Google review, ([A-Z][a-z]+ \d{4})$/;
export function quotedReview(hint: string, live: Review[]): Review | null {
  const m = hint.match(QUOTE_RE);
  if (!m) return null;
  const [, text, author, monthYear] = m;
  const source = live.find((r) => r.text.includes(text));
  return {
    author,
    rating: source?.rating ?? 5,
    text,
    date: source?.date ?? new Date(`1 ${monthYear} UTC`).toISOString(),
    photo: source?.photo ?? null,
    url: source?.url ?? null,
  };
}
