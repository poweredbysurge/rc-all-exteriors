// Read-only access to design/tokens.css for the few places a raw token value
// is needed outside CSS (meta theme-color, generated share cards).
import raw from '../../design/tokens.css?raw';

const tokens = new Map<string, string>();
for (const m of raw.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) tokens.set(m[1], m[2].trim());

export function token(name: string): string {
  const value = tokens.get(name);
  if (!value) throw new Error(`design/tokens.css has no ${name}`);
  return value;
}
