import Redis from "ioredis";
import { ENV } from "./env";

const MAX_RETRIES = ENV.REDIS_MAX_RETRIES;
let retryCount = 0;

let redis: Redis | null = null;
let redisAvailable = false;

export const initRedis = async (): Promise<Redis | null> => {
  const url = ENV.REDIS_URL;

  if (!url) {
    console.log("📦 Redis disabled — REDIS_URL not provided.");
    return null;
  }

  return new Promise((resolve) => {
    const client = new Redis(url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy: (times) => {
        retryCount = times;

        if (times > MAX_RETRIES) {
          console.error(`❌ Redis failed after ${MAX_RETRIES} retries → Switching to in-memory mode.`);
          resolve(null);  // <── important
          return null;
        }

        const delay = Math.min(times * 1000, 5000);
        console.warn(`⚠️ Redis retry attempt ${times} in ${delay / 1000}s...`);
        return delay;
      },
    });

    client.on("ready", () => {
      console.log("✅ Redis connected successfully");
      redis = client;
      redisAvailable = true;
      resolve(redis);
    });

    client.on("error", (err) => {
      console.error("❌ Redis error:", err.message);
    });

    client.on("end", () => {
      console.error("🔌 Redis connection closed");
    });
  });
};

export const isRedisAvailable = (): boolean => redisAvailable;

export { redis };