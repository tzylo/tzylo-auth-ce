import { db } from "../db/db";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { OtpService } from "otp/otp.service";
import { InvalidCredentialsError, AccountAlreadyExistsError, EmailAlreadyVerifiedError } from "errors/auth.errors";

class AuthService {
  async register(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();

    const existing = await db.auth.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) throw new AccountAlreadyExistsError();

    const hashed = await hashPassword(password);

    const user = await db.auth.create({
      data: { email: normalizedEmail, password: hashed },
    });

    const accessToken = signAccessToken(user.id, user.email, user.isVerified, user.role);
    const refreshToken = signRefreshToken(user.id, user.email, user.isVerified, user.role);

    await db.auth.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    OtpService.generateOtp(email)

    const { password: _ignored, ...safeUser } = user;

    return { user: safeUser, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();

    const user = await db.auth.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) throw new InvalidCredentialsError();

    const valid = await verifyPassword(password, user.password);
    if (!valid) throw new InvalidCredentialsError();

    const accessToken = signAccessToken(user.id, user.email, user.isVerified, user.role);
    const refreshToken = signRefreshToken(user.id, user.email, user.isVerified, user.role);

    await db.auth.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const { password: _ignored, ...safeUser } = user;

    return { user: safeUser, accessToken, refreshToken };
  }

  async verifyEmail(email: string) {
  const normalizedEmail = email.toLowerCase();

  const user = await db.auth.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw new Error("Account not found");
  }

  if (user.isVerified) {
    throw new EmailAlreadyVerifiedError();
  }

  const updatedUser = await db.auth.update({
    where: { email: normalizedEmail },
    data: { isVerified: true },
  });

  const { password: _ignored, ...safeUser } = updatedUser;

  return {
    user: safeUser,
  };
}
}

export default new AuthService();
