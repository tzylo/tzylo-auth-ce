import NodeCache from "node-cache";

const localCache = new NodeCache();

interface Bucket {
  tokens: number;
  lastRefill: number;
}

export const localConsume = (
  key: string,
  capacity: number,
  refillRate: number
): boolean => {

  let bucket: Bucket =
    localCache.get(key) || { tokens: capacity, lastRefill: Date.now() };

  const now = Date.now();
  const elapsed = (now - bucket.lastRefill) / 1000;

  bucket.tokens = Math.min(capacity, bucket.tokens + elapsed * refillRate);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    localCache.set(key, bucket);
    return false;
  }

  bucket.tokens -= 1;
  localCache.set(key, bucket);
  return true;
};
