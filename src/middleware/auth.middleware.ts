import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  try {
    let token: string | undefined;

    // 1. From Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. (Optional) From cookies, if you enable cookies
    if (!token && (req as any).cookies?.accessToken) {
      token = (req as any).cookies.accessToken;
    }

    if (!token) {
      return reply.status(401).send({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      userId: string;
      email: string;
    };

    // Attach user info to request
    (req as any).userId = decoded.userId;
    (req as any).email = decoded.email;

  } catch (err: any) {
    return reply.status(401).send({
      success: false,
      message: "Unauthorized: Invalid or expired token",
    });
  }
}
