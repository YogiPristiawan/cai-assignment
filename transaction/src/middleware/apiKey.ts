import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import env from "@src/config/env";

export default function apiKeyMiddleware(
  req: FastifyRequest,
  res: FastifyReply,
  done: HookHandlerDoneFunction,
) {
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== env.APP_SECRET) {
    return res
      .code(401)
      .header("Content-Type", "application/json")
      .send({ message: "unauthorized" });
  }

  done();
}
