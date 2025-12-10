import { FastifyReply, FastifyRequest } from "fastify";
import SessionService from "./session.service";
import { verifyToken } from "../utils/jwt";

class SessionController {
  async me(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).userId;

      if (!userId) {
        return reply.status(401).send({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await SessionService.me(userId);

      return reply.send({
        success: true,
        user,
      });
    } catch (err: any) {
      console.error("Me Error:", err.message);

      return reply.status(400).send({
        success: false,
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

    const userId = decoded.userId;

      const result = await SessionService.refresh(userId, refreshToken);

      return reply.send({
        success: true,
        ...result,
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
      const userId = (req as any).userId;

      if (!userId) {
        return reply.status(200).send({
          success: true,
          message: "Unauthorized",
        });
      }

      const result = await SessionService.logout(userId);

      return reply.send({
        success: true,
        ...result,
      });
    } catch (err: any) {
      console.error("Logout Error:", err.message);

      return reply.status(400).send({
        success: false,
        message: err.message || "Logout failed",
      });
    }
  }
}

export default new SessionController();
