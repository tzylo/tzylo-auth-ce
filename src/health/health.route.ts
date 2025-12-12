import { FastifyInstance } from "fastify";
import { checkDatabase } from "./dbHealth";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/", async (_, reply) => {
    const result = await checkDatabase();
    const statusCode = result.status === "ok" ? 200 : 503;
    return reply.status(statusCode).send(result);
  });
}
