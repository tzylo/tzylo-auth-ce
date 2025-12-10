import { db } from "../db/db";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

class SessionService {
  async me(userId: string) {
    const user = await db.auth.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    const { password: _ignored, refreshToken: _rt, ...safeUser } = user;
    return safeUser;
  }

  async refresh(userId: string, incomingToken: string) {
    const user = await db.auth.findUnique({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new Error("Session expired. Please login again.");
    }

    // Single-device: verify incoming refresh token matches DB
    if (user.refreshToken !== incomingToken) {
      throw new Error("Invalid refresh token");
    }

    // Issue new tokens
    const newAccessToken = signAccessToken(user.id, user.email);
    const newRefreshToken = signRefreshToken(user.id, user.email);

    // Replace refresh token (single device)
    await db.auth.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: string) {
    const user = await db.auth.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    // Invalidate refresh token
    await db.auth.update({
      where: { id: userId },
      data: { refreshToken: null },
    });

    return { message: "Logged out successfully" };
  }
}

export default new SessionService();
