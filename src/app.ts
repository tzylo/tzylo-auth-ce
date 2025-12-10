import Fastify, { FastifyInstance, FastifyPluginAsync } from "fastify";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import { ENV } from "./config/env";
import { bootstrapDatabase } from "./db/bootstrap";
import { initRedis } from "./config/redis";
import { initMailer } from "./config/mailer";
import { errorHandler } from "./shared/errorHandler";
import authRoutes from "./auth/auth.routes";
import otpRoutes from "./otp/otp.routes";
import sessionRoutes from "./session/session.routes";
import passwordRoutes from "./password/password.routes";
import { healthRoutes } from "./health/health.route";

const isProduction = ENV.NODE_ENV === "production";

const routes: FastifyPluginAsync = async (app) => {
  app.register(authRoutes);
  app.register(otpRoutes);
  app.register(sessionRoutes);
  app.register(passwordRoutes);
};

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: !isProduction,
  });

  
  await app.register(cors, {
    origin: ENV.CORS_ORIGIN || "*",
    credentials: true,
  });

  if (ENV.COOKIE_SECRET) {
    app.register(fastifyCookie, { secret: ENV.COOKIE_SECRET });
  } else {
    app.register(fastifyCookie);
  }

  if (!ENV.COOKIE_SECRET) {
    app.log.warn("COOKIE_SECRET not set cookies will NOT be signed.");
  }

  app.get("/", async () => ({
    status: "ok",
    message: "Auth Service CE is running",
  }));

  await bootstrapDatabase();

  try {
    await initMailer();
    console.log("📧 Mailer initialized");
  } catch (err) {
    console.error("❌ Mailer initialization failed:", err);
  }

  const redis = await initRedis();

  if (redis) {
    console.log("Redis enabled.");
  } else {
    console.log("Redis disabled — running in in-memory mode.");
  }

  app.register(healthRoutes, { prefix: "/health/db"});
  app.register(routes, { prefix: "/api/auth" });

  app.setErrorHandler(errorHandler);

  return app;
}
