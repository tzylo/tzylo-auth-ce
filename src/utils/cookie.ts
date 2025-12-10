import ms, { StringValue } from "ms";
import { ENV } from "../config/env";

type SameSiteType = "none" | "lax" | "strict";

function toExpirySeconds(value: StringValue): number {
  return Math.floor(ms(value) / 1000);
}

function getDefaultSameSite(): SameSiteType {
  const mode = ENV.NODE_ENV;

  const envValue = ENV.COOKIE_SAME_SITE?.toLowerCase() as SameSiteType | undefined;
  if (envValue === "none" || envValue === "lax" || envValue === "strict") {
    return envValue;
  }

  if (mode === "production") {
    return "none";
  }

  return "lax";
}

export function getCookieOptions() {
  const isProd = ENV.NODE_ENV === "production";
  const maxAge = toExpirySeconds(ENV.REFRESH_TOKEN_EXPIRES_IN);

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: getDefaultSameSite(),
    path: "/",
    maxAge,
  };
}


