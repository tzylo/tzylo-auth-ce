import { db } from "./db";
import { ENV } from "../config/env";

export async function bootstrapDatabase() {
  const dialect = ENV.DB_DIALECT;

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

  try {
    await db.auth.findFirst();
    console.log("🗄️ Database ready.");
    return;
  } catch {
    console.log("⚠️ Auth table missing. Creating...");
  }

  let sql: string;

  switch (dialect) {
    case "sqlite":
      sql = SQLITE_TABLE;
      break;
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

  try {
        await db.$executeRawUnsafe(sql);
        console.log("✅ Auth table created successfully.");
      } catch (err: any) {
        console.error("❌ Failed to create auth table.");

        if (err instanceof Error) {
          const message = err.message.split("\n")[0]+err.message.split("\n")[1];

          console.error("Reason:", message);
        }

        console.error(
          `🔧 Possible causes:
          • Database server is not reachable
          • DATABASE_URL is incorrect
          • User does not have CREATE TABLE permission
          • SQL syntax not supported by this DB engine
          `
        );

        process.exit(1);
      }

  console.log("✅ Auth table created successfully.");
}
