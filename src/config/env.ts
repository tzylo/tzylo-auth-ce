import dotenv from "dotenv";
import path from "path";
import { toMsStringValue } from "../utils/toMsStringValue";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

function getRequired(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Missing required environment variable: ${name}`);
    process.exit(1);
  }
  return value;
}

function getOptional(name: string, fallback: string): string {
  return process.env[name] ?? fallback;
}

function detectDialectFromUrl(url: string): string {
  const lower = url.toLowerCase();

  if (lower.startsWith("postgres://") || lower.startsWith("postgresql://"))
    return "postgresql";

  if (lower.startsWith("mysql://"))
    return "mysql";

  if (lower.startsWith("sqlserver://") || lower.startsWith("mssql://"))
    return "sqlserver";

  if (lower.startsWith("sqlite://"))
    return "sqlite";

  console.error("❌ Unsupported or invalid DATABASE_URL format.");
  process.exit(1);
}

const DATABASE_URL = getRequired("DATABASE_URL");
const DB_DIALECT = detectDialectFromUrl(DATABASE_URL);

export const ENV = {
  JWT_SECRET: getRequired("JWT_SECRET"),

  PORT: Number(getOptional("PORT", "7200")),
  CORS_ORIGIN: getOptional("CORS_ORIGIN", "*"),
  NODE_ENV: getOptional("NODE_ENV", "development"),

  RATE_LIMIT: getOptional("RATE_LIMIT", "true") === "true",

  DB_DIALECT,
  DATABASE_URL,

  ACCESS_TOKEN_EXPIRES_IN: toMsStringValue(process.env.ACCESS_TOKEN_EXPIRES_IN || "", "15m"),
  REFRESH_TOKEN_EXPIRES_IN: toMsStringValue(process.env.REFRESH_TOKEN_EXPIRES_IN || "", "7d"),

  BCRYPT_SALT_ROUNDS: getOptional("BCRYPT_SALT_ROUNDS", "10"),

  SMTP_HOST: getOptional("SMTP_HOST", "smtp.gmail.com"),
  SMTP_PORT: Number(getOptional("SMTP_PORT", "587")),
  SMTP_USERNAME: getOptional("SMTP_USERNAME", ""),
  SMTP_PASSWORD: getOptional("SMTP_PASSWORD", ""),

  REDIS_URL: getOptional("REDIS_URL", ""),
  REDIS_MAX_RETRIES: Number(getOptional("REDIS_MAX_RETRIES", "1")),

  APP_NAME: getOptional("APP_NAME", "Tzylo"),

  RATE_LIMIT_ENABLED: getOptional("RATE_LIMIT_ENABLED", "true") === "true",

  COOKIE_SECRET: getOptional("COOKIE_SECRET", ""),
  COOKIE_SAME_SITE: getOptional("COOKIE_SAME_SITE", "")
};
