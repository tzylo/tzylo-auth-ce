import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env";

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token && (req as any).cookies?.accessToken) {
      token = (req as any).cookies.accessToken;
    }

    if (!token) {
      return reply.status(401).send({
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, ENV.JWT_SECRET) as {
      authId: string;
      email: string;
    };

    (req as any).authId = decoded.authId;
    (req as any).email = decoded.email;

  } catch (err: any) {
    return reply.status(401).send({
      message: "Unauthorized: Invalid or expired token",
    });
  }
}
