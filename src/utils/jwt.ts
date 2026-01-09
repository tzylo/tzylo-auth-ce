import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

const ACCESS_TOKEN_EXPIRES = ENV.ACCESS_TOKEN_EXPIRES_IN;
const REFRESH_TOKEN_EXPIRES = ENV.REFRESH_TOKEN_EXPIRES_IN;

export function signAccessToken(authId: string, email: string, isVerified: boolean, role: string) {
  return jwt.sign({ authId, email, isVerified, role }, ENV.JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES,
  });
}

export function signRefreshToken(authId: string, email: string, isVerified: boolean, role: string) {
  return jwt.sign({ authId, email, isVerified, role, type: "refresh" }, ENV.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, ENV.JWT_SECRET);
}
