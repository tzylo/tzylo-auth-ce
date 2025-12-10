import { FastifyInstance } from "fastify";
import OtpController from "./otp.controller";
import { rateLimiter } from "../middleware/rateLimit.middleware";

export default async function otpRoutes(app: FastifyInstance) {

  app.post(
    "/send-otp",
    { preHandler: rateLimiter("otp") },
    OtpController.sendOtp
  );
}
