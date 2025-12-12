import fs from "fs";
import { execSync } from "child_process";

const DB_TYPES = ["sqlite", "postgresql", "mysql", "sqlserver"] as const;

function log(msg: string) {
  console.log(msg);
}

function generateFor(db: string) {
  log(`\n🔧 Generating client for: ${db}`);

  execSync(
    `npx prisma generate --schema prisma/schema.${db}.prisma`,
    { stdio: "inherit" }
  );

  log(`✔ Client ready: generated/${db}`);
}

function main() {
  log("🚀 Generating all Prisma clients...");
  fs.mkdirSync("generated", { recursive: true });

  for (const db of DB_TYPES) generateFor(db);

  log("\n🎉 All clients generated.");
}

main();
