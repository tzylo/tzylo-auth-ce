import Fastify from "fastify";
import authRoutes from "../src/auth/auth.routes";
import otpRoutes from "../src/otp/otp.routes";

export async function buildTestApp() {
  const app = Fastify({
    logger: false,   // disable logs in tests
  });

  // Register only necessary plugins
  app.register(require("@fastify/cookie"));

  // Register all routes your API uses
  app.register(authRoutes);
  app.register(otpRoutes);

  return app;
}
