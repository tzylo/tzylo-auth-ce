import { hash, compare } from "@node-rs/bcrypt";
import { ENV } from "../config/env";

const SALT_ROUNDS = Number(ENV.BCRYPT_SALT_ROUNDS || 10);

export async function hashPassword(password: string): Promise<string> {
  return hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash);
}
