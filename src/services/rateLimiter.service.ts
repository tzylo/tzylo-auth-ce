import { isRedisAvailable } from "../config/redis";
import { redisConsume } from "../utils/redisBucket";
import { localConsume } from "../utils/localBucket";

export class RateLimiterService {
  private capacity: number;
  private refillRate: number;

  constructor(capacity: number, refillRate: number) {
    this.capacity = capacity;
    this.refillRate = refillRate;
  }

  async consume(key: string): Promise<boolean> {
    if (isRedisAvailable()) {
      const allowed = await redisConsume(key, this.capacity, this.refillRate);
      if (allowed !== false) return allowed;
    }

    return localConsume(key, this.capacity, this.refillRate);
  }
}


export const otpLimiter = new RateLimiterService(5, 1 / 60);
export const loginLimiter = new RateLimiterService(10, 1 / 30)