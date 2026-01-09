import { FastifyReply, FastifyRequest } from "fastify";
import SessionService from "./session.service";
import { verifyToken } from "../utils/jwt";
import { getCookieOptions } from "@utils/cookie";

class SessionController {
  async me(req: FastifyRequest, reply: FastifyReply) {
    try {
      const authId = (req as any).authId;

      if (!authId) {
        return reply.status(401).send({
          message: "Unauthorized",
        });
      }

      const user = await SessionService.me(authId);

      return reply.send({
        user: {
          id: user.id,
          email: user.email,
          isVerified: user.isVerified,
          role: user.role
        }
      });
    } catch (err: any) {
      console.error("Me Error:", err.message);

      return reply.status(400).send({
        message: err.message || "Failed to load user",
      });
    }
  }

  async refresh(req: FastifyRequest, reply: FastifyReply) {
    try {
      const refreshToken = (req as any).cookies?.refresh_token;

      if (!refreshToken) {
        return reply.status(400).send({
          success: false,
          message: "Refresh token required",
        });
      }

      let decoded;
      try {
        decoded = verifyToken(refreshToken) as {
          userId: string;
          email: string;
        };
      } catch {
        return reply.status(401).send({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }

      const authId = decoded.authId;

      const result = await SessionService.refresh(authId, refreshToken);

      return reply.setCookie(
            "refresh_token",
            result.refreshToken,
            getCookieOptions()
          ).send({
        accessToken: result.accessToken
      });

    } catch (err: any) {
      console.error("Refresh Error:", err.message);

      return reply.status(401).send({
        success: false,
        message: err.message || "Token refresh failed",
      });
    }
  }

  async logout(req: FastifyRequest, reply: FastifyReply) {
    try {
      const authId = (req as any).authId;

      if (!authId) {
        return reply.status(401).send({
          message: "Unauthorized",
        });
      }

      const result = await SessionService.logout(authId);

      return reply.send({
        ...result,
      });
    } catch (err: any) {
      console.error("Logout Error:", err.message);

      return reply.status(400).send({
        message: err.message || "Logout failed",
      });
    }
  }
}

export default new SessionController();
