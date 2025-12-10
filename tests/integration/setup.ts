import dotenv from "dotenv";
import { execSync } from "child_process";

dotenv.config({ path: ".env.test" });

import { buildTestApp } from "../app.test";

beforeAll(async () => {
  execSync("npx prisma migrate reset --force", { stdio: "ignore" });

  global.app = await buildTestApp();
  await global.app.ready();
});

afterAll(async () => {
  await global.app.close();
});
