import { db } from "../db/db";

export async function checkDatabase() {
  try {
    await db.auth.findFirst({ select: { id: true } });

    return {
      status: "ok",
      message: "Database connected and schema valid",
    };
  } catch (err: any) {
    return {
      status: "error",
      message: "Database unreachable or schema invalid",
      error: err.message,
    };
  }
}
