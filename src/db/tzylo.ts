import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError
} from "@prisma/client/runtime/library";

import { TzyloDBError , TzyloDBInitializationError, TzyloDBQueryError } from "../errors/db.error";
import { db } from "./db";

export const TzyloDB = {
  async safeQuery<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (err: any) {

      if (err instanceof PrismaClientInitializationError) {
        throw new TzyloDBInitializationError(
          "Failed to connect to the database. Check your Tzylo DB configuration."
        );
      }

      if (err instanceof PrismaClientKnownRequestError) {
        throw new TzyloDBQueryError(
          "Database query failed. Please verify your input or schema."
        );
      }

      if (err instanceof PrismaClientRustPanicError) {
        throw new TzyloDBInitializationError(
          "Tzylo DB engine encountered an internal error."
        );
      }

      // fallback
      throw new TzyloDBError("Unknown database error occurred.");
    }
  }
};
