import { redis } from "../config/redis";

const LUA_SCRIPT = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local bucket = redis.call("HMGET", key, "tokens", "lastRefill")

local tokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])

if tokens == nil then
  tokens = capacity
  lastRefill = now
end

local elapsed = now - lastRefill
tokens = math.min(capacity, tokens + (elapsed * refill_rate))
lastRefill = now

if tokens < 1 then
  redis.call("HMSET", key, "tokens", tokens, "lastRefill", lastRefill)
  redis.call("EXPIRE", key, 3600)
  return 0
end

tokens = tokens - 1
redis.call("HMSET", key, "tokens", tokens, "lastRefill", lastRefill)
redis.call("EXPIRE", key, 3600)

return 1
`

export const redisConsume = async (
  key: string,
  capacity: number,
  refillRate: number
): Promise<boolean> => {
  if (!redis) return false; // fallback handled outside

  const now = Date.now() / 1000; // seconds

  try {
    const result = await redis.eval(LUA_SCRIPT, 1, key, capacity, refillRate, now);
    return result === 1;
  } catch (err) {
    console.error("Redis limiter LUA error:", err);
    return false;
  }
};
