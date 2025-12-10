import { execSync } from "child_process";

export async function autoSyncDatabase() {
  try {
    
    console.log("🔄 Running database AutoSync (db push)...");
    execSync("npx prisma db push --accept-data-loss", { stdio: "ignore" });

    console.log("✅ database schema synced successfully");
  } catch (err) {
    console.error("❌ database AutoSync failed:", err);
    console.log("⚠ Continuing with fallback mode…");
  }
}
