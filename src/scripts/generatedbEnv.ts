import fs from "fs";
import path from "path";
import { ENV } from "../config/env";

export function generatedbEnv() {
  const prismaEnvPath = path.join(process.cwd(), "prisma" ,".env");

  const content = `DB_DIALECT="${ENV.DB_DIALECT}"
DATABASE_URL="${ENV.DATABASE_URL}"
`;

  //fs.writeFileSync(prismaEnvPath, content, { encoding: "utf8" });
  console.log("🔹 database runtime env generated:");
}


if (require.main === module) {
  generatedbEnv();
}
