import fs from "fs";
import path from "path";
import dotenv from "dotenv";

const userEnv = path.join(process.cwd(), ".env");
const fallbackEnv = path.join(__dirname, "../package_internal/default.prisma.env");


// 1. Load user env if exists
if (fs.existsSync(userEnv)) {
  dotenv.config({ path: userEnv });
}

// 2. If DATABASE_URL missing → load fallback
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: fallbackEnv });
}
