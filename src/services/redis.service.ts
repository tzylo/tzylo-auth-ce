import { redis } from "../config/redis";

export class RedisService {
  /**
   * Safely check if redis is connected
   */
  private static assertRedis() {
    if (!redis) {
      throw new Error("Redis is not initialized or unavailable.");
    }
  }

  /**
   * Set key in Redis with optional TTL
   */
  static async set(key: string, value: any, ttlInSeconds: number | null = null): Promise<void> {
    this.assertRedis();

    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);

    if (ttlInSeconds) {
      await redis!.set(key, stringValue, "EX", ttlInSeconds);
    } else {
      await redis!.set(key, stringValue);
    }
  }

  /**
   * Get key from Redis and JSON.parse if applicable
   */
  static async get<T = any>(key: string): Promise<T | string | null> {
    this.assertRedis();

    const data = await redis!.get(key);
    if (data === null) return null;

    try {
      return JSON.parse(data) as T;
    } catch {
      return data;
    }
  }

  /**
   * Delete a key
   */
  static async del(key: string): Promise<number> {
    this.assertRedis();
    return redis!.del(key);
  }

  /**
   * Check if key exists
   */
  static async exists(key: string): Promise<boolean> {
    this.assertRedis();
    const count = await redis!.exists(key);
    return count > 0;
  }
}
