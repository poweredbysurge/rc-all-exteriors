// Service-area map background: a Google Static Map styled in the site's
// palette, fetched once at build through the image pipeline and served as a
// local WebP (ADR-010). The page makes no request to Google, loads no script,
// and the key never leaves the build. Our own markers and labels sit on top,
// placed by the same Web Mercator projection Google used to draw the tile, so
// a pin lands on its town.
//
// Without GOOGLE_PLACES_KEY (a keyless local build) the caller falls back to
// the schematic (ADR-004), so a build never fails for want of a map.
import { getImage } from 'astro:assets';
import theme from '@/styles/theme.generated.css?raw';

export interface LatLon {
  lat: number;
  lon: number;
}

export interface StaticMap {
  /** Local image path, or null when there is no key or the fetch failed. */
  src: string | null;
  /** Percent position of a point inside the image, for absolutely placed markers. */
  project: (p: LatLon) => { x: number; y: number };
  zoom: number;
}

const TILE = 256;

function token(name: string): string {
  const hit = theme.match(new RegExp(`--rc-${name}:\\s*#([0-9A-Fa-f]{6})`));
  if (!hit) throw new Error(`theme.generated.css has no --rc-${name}`);
  return `0x${hit[1].toUpperCase()}`;
}

/** Google's own labels, POIs, transit and borders are off; we draw the towns. */
function styles(): string[] {
  return [
    'feature:all|element:labels|visibility:off',
    'feature:administrative|visibility:off',
    'feature:poi|visibility:off',
    'feature:transit|visibility:off',
    `feature:landscape|element:geometry|color:${token('map-land')}`,
    `feature:poi.park|element:geometry|visibility:on|color:${token('map-park')}`,
    `feature:road|element:geometry.stroke|visibility:off`,
    `feature:road|element:geometry.fill|color:${token('map-road')}`,
    `feature:road.highway|element:geometry.fill|color:${token('map-highway')}`,
    'feature:road.local|visibility:off',
    `feature:water|element:geometry|color:${token('map-water')}`,
  ];
}

// Web Mercator in tile pixels at a zoom.
const world = (zoom: number) => TILE * 2 ** zoom;
function toPixel(p: LatLon, zoom: number) {
  const s = world(zoom);
  const sin = Math.sin((p.lat * Math.PI) / 180);
  return {
    x: ((p.lon + 180) / 360) * s,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * s,
  };
}

/**
 * The largest integer zoom at which every place fits inside the image with
 * the given padding (fractions of the image on each side), and the centre
 * that puts the places' bounding box in the padded area.
 */
function fit(places: LatLon[], width: number, height: number, pad: { left: number; right: number; top: number; bottom: number }) {
  for (let zoom = 14; zoom >= 1; zoom--) {
    const px = places.map((p) => toPixel(p, zoom));
    const xs = px.map((p) => p.x);
    const ys = px.map((p) => p.y);
    const w = Math.max(...xs) - Math.min(...xs);
    const h = Math.max(...ys) - Math.min(...ys);
    if (w <= width * (1 - pad.left - pad.right) && h <= height * (1 - pad.top - pad.bottom)) {
      // Centre so the box sits in the padded area, not the image centre.
      const cx = Math.min(...xs) + w / 2 + ((pad.right - pad.left) / 2) * width;
      const cy = Math.min(...ys) + h / 2 + ((pad.bottom - pad.top) / 2) * height;
      return { zoom, cx, cy };
    }
  }
  return { zoom: 1, cx: 0, cy: 0 };
}

function fromPixel(x: number, y: number, zoom: number): LatLon {
  const s = world(zoom);
  const lon = (x / s) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / s;
  return { lat: (180 / Math.PI) * Math.atan(Math.sinh(n)), lon };
}

export async function staticMap(
  places: LatLon[],
  opts: { width: number; height: number; pad: { left: number; right: number; top: number; bottom: number } },
): Promise<StaticMap> {
  const { width, height, pad } = opts;
  const { zoom, cx, cy } = fit(places, width, height, pad);
  const project = (p: LatLon) => {
    const px = toPixel(p, zoom);
    return { x: 50 + ((px.x - cx) / width) * 100, y: 50 + ((px.y - cy) / height) * 100 };
  };
  const key = process.env.GOOGLE_PLACES_KEY ?? (import.meta.env?.GOOGLE_PLACES_KEY as string | undefined);
  if (!key) return { src: null, project, zoom };
  const centre = fromPixel(cx, cy, zoom);
  const params = new URLSearchParams({
    center: `${centre.lat.toFixed(6)},${centre.lon.toFixed(6)}`,
    zoom: String(zoom),
    size: `${width}x${height}`,
    scale: '2',
    maptype: 'roadmap',
    format: 'png',
    key,
  });
  for (const s of styles()) params.append('style', s);
  const url = `https://maps.googleapis.com/maps/api/staticmap?${params}`;
  try {
    const img = await getImage({ src: url, width: width * 2, height: height * 2, format: 'webp', quality: 82, inferSize: true });
    return { src: img.src, project, zoom };
  } catch (err) {
    console.warn('[map] static map skipped:', (err as Error).message);
    return { src: null, project, zoom };
  }
}
