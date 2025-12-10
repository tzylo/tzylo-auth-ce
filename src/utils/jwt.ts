import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

const ACCESS_TOKEN_EXPIRES = ENV.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES = ENV.REFRESH_TOKEN_EXPIRES_IN;

export function signAccessToken(userId: string, email: string) {
  return jwt.sign({ userId, email }, ENV.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
}

export function signRefreshToken(userId: string, email: string) {
  return jwt.sign({ userId, email, type: "refresh" }, ENV.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, ENV.JWT_SECRET);
}
