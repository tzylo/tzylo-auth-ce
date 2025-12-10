import { buildApp } from "./app";
import { ENV } from "./config/env";

const PORT = ENV.PORT ? Number(ENV.PORT) : 7200;

async function startServer() {
  const app = await buildApp();

  try {
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });
    console.log(`🚀 Server running on port ${PORT}`);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
}

startServer();
