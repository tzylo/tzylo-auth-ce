import { RateLimiterService } from "../../src/services/rateLimiter.service";
import { isRedisAvailable } from "../../src/config/redis";

jest.mock("../../src/config/redis", () => ({
  isRedisAvailable: jest.fn(() => false),
}));

describe("RateLimiter - Local Mode", () => {
  it("should allow first few requests", async () => {
    const limiter = new RateLimiterService(3, 1); // 3 tokens

    expect(await limiter.consume("u1")).toBe(true);
    expect(await limiter.consume("u1")).toBe(true);
    expect(await limiter.consume("u1")).toBe(true);
  });

  it("should block when bucket is empty", async () => {
    const limiter = new RateLimiterService(1, 0); // no refill

    await limiter.consume("x1");
    const blocked = await limiter.consume("x1");

    expect(blocked).toBe(false);
  });
});
