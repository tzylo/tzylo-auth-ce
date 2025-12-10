import { FastifyInstance } from "fastify";

declare global {
  var app: FastifyInstance;
}

export {};
