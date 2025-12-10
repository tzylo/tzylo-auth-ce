import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { db } from "./db";
import { ENV } from "../config/env";

export async function bootstrapDatabase() {
  const dialect = ENV.DB_DIALECT;

  // ------------------------------------------------
  // SQLITE TABLE (matches your Prisma SQLite schema)
  // ------------------------------------------------
  const SQLITE_TABLE = `
    CREATE TABLE IF NOT EXISTS auth (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_verified INTEGER DEFAULT 0,
      provider TEXT DEFAULT 'local',
      role TEXT,
      refresh_token TEXT,
      last_login_at TEXT,
      metadata TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // ------------------------------------------------
  // POSTGRES TABLE (matches your PostgreSQL schema)
  // ------------------------------------------------
  const POSTGRES_TABLE = `
    CREATE TABLE IF NOT EXISTS auth (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password TEXT NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      provider VARCHAR(50) DEFAULT 'local',
      role VARCHAR(50),
      refresh_token TEXT,
      last_login_at TIMESTAMP,
      metadata JSON,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `;

  // ------------------------------------------------
  // MYSQL TABLE (matches your MySQL schema)
  // ------------------------------------------------
  const MYSQL_TABLE = `
    CREATE TABLE IF NOT EXISTS auth (
      id VARCHAR(255) PRIMARY KEY,
      email VARCHAR(191) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      is_verified BOOLEAN DEFAULT FALSE,
      provider VARCHAR(100) DEFAULT 'local',
      role VARCHAR(100),
      refresh_token TEXT,
      last_login_at DATETIME,
      metadata JSON,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;

  // ------------------------------------------------
  // SQL SERVER TABLE (matches your SQLServer schema)
  // ------------------------------------------------
  const SQLSERVER_TABLE = `
    IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='auth' AND xtype='U')
    CREATE TABLE auth (
      id NVARCHAR(255) PRIMARY KEY,
      email NVARCHAR(255) NOT NULL UNIQUE,
      password NVARCHAR(4000) NOT NULL,
      is_verified BIT DEFAULT 0,
      provider NVARCHAR(100) DEFAULT 'local',
      role NVARCHAR(100),
      refresh_token NVARCHAR(4000),
      last_login_at DATETIME,
      metadata NVARCHAR(MAX),
      created_at DATETIME DEFAULT GETDATE(),
      updated_at DATETIME DEFAULT GETDATE()
    );
  `;

  // ==========================================================
  // 1. SQLITE MODE → You control schema fully (use Prisma push)
  // ==========================================================
  // if (dialect === "sqlite") {
  //   const isFileUrl = ENV.DATABASE_URL.startsWith("file:");
  //   if (isFileUrl) {
  //     const dbFile = ENV.DATABASE_URL.replace("file:", "");
  //     const absolute = path.isAbsolute(dbFile)
  //       ? dbFile
  //       : path.join(process.cwd(), dbFile);

  //     const dir = path.dirname(absolute);
  //     if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  //     console.log("🔄 Running SQLite schema sync...");
  //     execSync("npx prisma db push --schema=./prisma/schema.prisma", {
  //       stdio: "ignore",
  //     });

  //     console.log("✅ SQLite database ready.");
  //     return;
  //   }
  // }

  // ==========================================================
  // 2. EXTERNAL DBs → Safe runtime table creation
  // ==========================================================
  try {
    await db.auth.findFirst();
    console.log("🗄️ Auth table exists. Database ready.");
  } catch (err) {
    console.log("⚠️ Auth table missing. Creating...");

    let sql: string;

    switch (dialect) {
      case "postgres":
      case "postgresql":
        sql = POSTGRES_TABLE;
        break;

      case "mysql":
        sql = MYSQL_TABLE;
        break;

      case "sqlserver":
        sql = SQLSERVER_TABLE;
        break;

      default:
        console.error(`❌ Unsupported DB dialect: ${dialect}`);
        process.exit(1);
    }

    await db.$executeRawUnsafe(sql);

    console.log("✅ Auth table created successfully.");
  }
}
