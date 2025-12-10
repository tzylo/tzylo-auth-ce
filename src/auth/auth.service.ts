import { db } from "../db/db";
import { hashPassword, verifyPassword } from "../utils/password";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { welcomeEmailTemplate } from "../templates/welcomeEmail";
import { MailService } from "../services/MailService";

class AuthService {
  async register(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();

    const existing = await db.auth.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) throw new Error("Account already exists");

    const hashed = await hashPassword(password);

    const user = await db.auth.create({
      data: { email: normalizedEmail, password: hashed },
    });

    const accessToken = signAccessToken(user.id, user.email);
    const refreshToken = signRefreshToken(user.id, user.email);

    await db.auth.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const template = welcomeEmailTemplate(normalizedEmail);
    MailService.sendMail(normalizedEmail, template.subject, template.html).catch(() => {});

    const { password: _ignored, ...safeUser } = user;

    return { user: safeUser, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const normalizedEmail = email.toLowerCase();

    const user = await db.auth.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) throw new Error("Invalid credentials");

    const valid = await verifyPassword(password, user.password);
    if (!valid) throw new Error("Invalid credentials");

    const accessToken = signAccessToken(user.id, user.email);
    const refreshToken = signRefreshToken(user.id, user.email);

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
    return { message: "Email already verified" };
  }

  const updatedUser = await db.auth.update({
    where: { email: normalizedEmail },
    data: { isVerified: true },
  });

  const { password: _ignored, ...safeUser } = updatedUser;

  return {
    message: "Email verified successfully",
    user: safeUser,
  };
}
}

export default new AuthService();
