import "../config/init-env";
import { ENV } from "../config/env";
import { TzyloError } from "../errors/Tzylo.error";
import { TzyloDBError } from "../errors/TzyloDBError";

const dbType = ENV.DB_DIALECT?.toLowerCase() || "sqlite";

/*****************************************
 * 1. Load correct Prisma client per dialect
 *****************************************/
function loadClient() {
  switch (dbType) {
    case "postgres":
    case "postgresql":
      return require("../../generated/postgresql/@prisma/client").PrismaClient;

    case "mysql":
      return require("../../generated/mysql/@prisma/client").PrismaClient;

    case "sqlite":
    case "sqlite3":
      return require("../../generated/sqlite/@prisma/client").PrismaClient;

    case "sqlserver":
    case "mssql":
      return require("../../generated/sqlserver/@prisma/client").PrismaClient;

    default:
      throw new Error(`❌ Unknown DB type "${dbType}". Valid: postgresql, mysql, sqlite, sqlserver`);
  }
}

const SelectedClient = loadClient();
const prisma = new SelectedClient({
  log: [], // Keep logs clean
});

/*****************************************
 * 2. Prisma → TzyloError converter for known cases
 *****************************************/
function convertKnownPrismaError(e: any) {
  if (!e?.code) return null;

  switch (e.code) {
    case "P2002":
      return new TzyloError("Duplicate value not allowed", "DUPLICATE_ENTRY", 409);
    case "P2025":
      return new TzyloError("Record not found", "NOT_FOUND", 404);
    case "P2009":
      return new TzyloError("Invalid input", "INVALID_INPUT", 400);
    default:
      return null;
  }
}

/*****************************************
 * 3. Deep Proxy – wraps nested client delegates (auth, user, etc.)
 *****************************************/
function wrapDeep(target: any): any {
  return new Proxy(target, {
    get(obj, prop) {
      const value = obj[prop];

      // Non-function object → recurse (e.g. obj.auth)
      if (typeof value === "object" && value !== null) {
        return wrapDeep(value);
      }

      // Function → wrap it
      if (typeof value === "function") {
        return (...args: any[]) => {
          try {
            const result = value.apply(obj, args);

            if (result instanceof Promise) {
              return result.catch((err) => {
                const known = convertKnownPrismaError(err);
                if (known) throw known;
                throw TzyloDBError.fromPrisma(err);
              });
            }

            return result;
          } catch (err) {
            const known = convertKnownPrismaError(err);
            if (known) throw known;
            throw TzyloDBError.fromPrisma(err);
          }
        };
      }

      // Normal property
      return value;
    },
  });
}

/*****************************************
 * 4. Final exported DB client
 *****************************************/
export const db = wrapDeep(prisma);

// Keep original client if needed internally
export { prisma };
