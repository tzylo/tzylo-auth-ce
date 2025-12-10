import { FastifyInstance } from "fastify";
import controller from "./auth.controller";
import { rateLimiter } from "../middleware/rateLimit.middleware";

async function authRoutes(app: FastifyInstance) {
  app.post("/register", { preHandler: rateLimiter("otp") }, controller.register);
  app.post("/login",{ preHandler: rateLimiter("login") }, controller.login);
    app.post(
    "/verify-otp",{ preHandler: rateLimiter("otp") },
    controller.verifyEmail
  );
}

export default authRoutes;
