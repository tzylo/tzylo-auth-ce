import { ENV } from "../config/env";
import { FastifyRequest, FastifyReply } from "fastify";
import { otpLimiter, loginLimiter } from "../services/rateLimiter.service";

const limiterMap: Record<string, any> = {
  otp: otpLimiter,
  login: loginLimiter,
};

export const rateLimiter =
  (type: "otp" | "login") =>
  async (req: FastifyRequest, reply: FastifyReply) => {

    if (!ENV.RATE_LIMIT_ENABLED) {
      return;
    }

    const key =
      (req.ip as string) ||
      (req.headers["x-forwarded-for"] as string) ||
      (req.body as any)?.email ||
      (req.body as any)?.phone ||
      "unknown";

    const bucketKey = `${type}:${key}`;

    const limiter = limiterMap[type];
    if (!limiter) {
      throw new Error(`Unknown rate limiter type: ${type}`);
    }

    const allowed = await limiter.consume(bucketKey);

    if (!allowed) {
      return reply.code(429).send({
        success: false,
        message: "Too many requests, please try again later.",
      });
    }
  };
