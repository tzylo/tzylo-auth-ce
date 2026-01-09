import { db } from "../db/db";
import { signAccessToken, signRefreshToken } from "../utils/jwt";

class SessionService {
  async me(authId: string) {
    const user = await db.auth.findUnique({ where: { id: authId } });
    if (!user) throw new Error("User not found");

    const { password: _ignored, refreshToken: _rt, ...safeUser } = user;
    return safeUser;
  }

  async refresh(authId: string, incomingToken: string) {
    const user = await db.auth.findUnique({ where: { id: authId } });

    if (!user || !user.refreshToken) {
      throw new Error("Session expired. Please login again.");
    }

    if (user.refreshToken !== incomingToken) {
      throw new Error("Invalid refresh token");
    }

    const newAccessToken = signAccessToken(user.id, user.email, user.isVerified, user.role);
    const newRefreshToken = signRefreshToken(user.id, user.email, user.isVerified, user.role);

    await db.auth.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(authId: string) {
    const user = await db.auth.findUnique({ where: { id: authId } });
    if (!user) throw new Error("User not found");

    await db.auth.update({
      where: { id: authId },
      data: { refreshToken: null },
    });

    return { message: "Logged out successfully" };
  }
}

export default new SessionService();
