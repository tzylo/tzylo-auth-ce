import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const DB_TYPES = [ "sqlite"] as const;

function log(msg: string) {
  console.log(msg);
}

function generateFor(db: string) {
  log(`\n🔧 Generating TzyloDB client for: ${db.toUpperCase()}`);

  const schemaSource = path.join("prisma", `schema.${db}.prisma`);
  const schemaTarget = path.join("prisma", "schema.prisma");

  // Copy schema.{db}.prisma → schema.prisma
  fs.copyFileSync(schemaSource, schemaTarget);

  // Generate Prisma client silently
  execSync(`npx prisma generate --schema prisma/schema.prisma --no-engine-check`, {
    stdio: "ignore",
    });


  // Output folder
  const outputDir = path.join("generated", db);

  // Clean old folder
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });

  // Copy generated Prisma client
  fs.cpSync("generated/@prisma/client", outputDir, { recursive: true });

  log(`✔ ${db.toUpperCase()} client generated at: generated/${db}`);
}

function main() {
  log("🚀 Starting Tzylo Multi-DB client generation...");

  // Make sure generated/ exists
  fs.mkdirSync("generated", { recursive: true });

  for (const db of DB_TYPES) {
    generateFor(db);
  }

  log("\n🎉 All TzyloDB clients generated successfully!");
}

main();
