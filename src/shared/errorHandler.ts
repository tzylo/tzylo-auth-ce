import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      success: false,
      error: "ValidationError",
      issues: error.flatten()
    });
  }

  if (error.code === "P2002") {
    return reply.status(409).send({
      success: false,
      error: "DuplicateEntry",
      message: "A record with this value already exists."
    });
  }

  if (error.code?.startsWith("P")) {
    return reply.status(500).send({
      success: false,
      error: "PrismaError",
      message: error.message
    });
  }

  return reply.status(error.statusCode || 500).send({
    success: false,
    error: error.name || "InternalServerError",
    message: error.message
  });
}
