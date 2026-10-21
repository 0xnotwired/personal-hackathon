type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();
const LIMIT = 30;
const WINDOW_MS = 60_000;

export function allow(key: string, now = Date.now()) {
  if (buckets.size > 5000) {
    for (const [name, bucket] of buckets) if (now >= bucket.reset) buckets.delete(name);
  }
  const bucket = buckets.get(key);
  if (!bucket || now >= bucket.reset) {
    buckets.set(key, { count: 1, reset: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= LIMIT) return false;
  bucket.count++;
  return true;
}

export function clientKey(req: { headers: { get(name: string): string | null } }) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || req.headers.get('x-real-ip') || 'local';
}
