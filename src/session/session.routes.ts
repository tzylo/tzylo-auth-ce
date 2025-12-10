import { FastifyInstance } from "fastify";
import SessionController from "./session.controller";
import { authMiddleware } from "../middleware/auth.middleware";

export default async function sessionRoutes(app: FastifyInstance) {
  
  app.get(
    "/me",
    { preHandler: authMiddleware },
    SessionController.me
  );

  app.post(
    "/refresh",
    SessionController.refresh
  );

  app.post(
    "/logout",
    { preHandler: authMiddleware },
    SessionController.logout
  );

}
