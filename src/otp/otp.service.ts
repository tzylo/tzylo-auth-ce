import crypto from "crypto";
import { isRedisAvailable } from "../config/redis";
import { RedisService } from "../services/redis.service";
import { otpStore } from "../config/otpStore";
import { otpVerificationEmailTemplate } from "../templates/emailVerification";
import { forgotPasswordEmailTemplate } from "../templates/forgotPasswordEmail";
import { MailService } from "../services/MailService";

export class OtpService {
  private static buildKey(email: string, type: string): string {
    return `${type}:${email.toLowerCase()}`;
  }

  /**
   * Generate OTP, store in Redis or fallback store, and send email.
   */
  static async generateOtp(
    email: string,
    type: string = "verify-email"
  ): Promise<string> {
    const normalizedEmail = email.toLowerCase();
    const key = this.buildKey(normalizedEmail, type);

    // Generate cryptographically secure OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Store OTP
    if (isRedisAvailable()) {
      await RedisService.set(key, otp, 300);
    } else {
      otpStore.set(key, otp, 300);
    }

    // Choose template
    const template =
      type === "forgot-password"
        ? forgotPasswordEmailTemplate(normalizedEmail, otp)
        : otpVerificationEmailTemplate(normalizedEmail, otp);

    // Send mail (CE: no queue, direct sending)
    await MailService.sendMail(normalizedEmail, template.subject, template.html);

    return otp;
  }

  /**
   * Verify OTP and delete key if valid.
   */
  static async verifyOtp(
    email: string,
    otp: string,
    type: string = "verify-email"
  ): Promise<boolean> {
    const normalizedEmail = email.toLowerCase();
    const key = this.buildKey(normalizedEmail, type);

    let storedValue: string | null = null;

    // Load from appropriate store
    if (isRedisAvailable()) {
      storedValue = await RedisService.get<string>(key);
    } else {
      storedValue = otpStore.get<string>(key) ?? null;
    }

    if (!storedValue) return false;

    const isValid = String(storedValue) === otp;

    if (isValid) {
      if (isRedisAvailable()) {
        await RedisService.del(key);
      } else {
        otpStore.del(key);
      }
    }

    return isValid;
  }
}
