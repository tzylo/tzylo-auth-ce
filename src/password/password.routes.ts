import { FastifyInstance } from "fastify";
import PasswordController from "./password.controller";

export default async function passwordRoutes(app: FastifyInstance) {

  app.post(
    "/forgot-password",
    PasswordController.forgotPassword
  );

  app.post(
    "/set-new-password",
    PasswordController.setNewPassword
  );

}
