import fastify from "fastify";
import cors from "@fastify/cors";
import formDataParser from "@fastify/formbody";

if (process.env.NODE_ENV === "development") {
  import("dotenv").then((dotenv) => {
    dotenv.config();
  });
}

import {
  CreateDepositIn,
  SendPaymentIn,
  WithdrawIn,
} from "@src/dto/transaction";
import {
  createDeposit,
  findTransactionByAccountId,
  sendPayment,
  withdraw,
} from "@src/presentation/transaction";

import apiKeyMiddleware from "@src/middleware/apiKey";

import Session from "supertokens-node/recipe/session";
import { plugin as supertokenPlugin } from "supertokens-node/framework/fastify";
import supertokens from "supertokens-node";
import { verifySession } from "supertokens-node/recipe/session/framework/fastify";

const server = fastify();

// init supertoken
supertokens.init({
  supertokens: {
    connectionURI: process.env.SUPERTOKENS_URI ?? "",
    apiKey: process.env.SUPERTOKENS_API_KEY,
  },
  appInfo: {
    appName: process.env.APP_NAME ?? "",
    websiteDomain: process.env.SUPERTOKENS_WEBSITE_DOMAIN ?? "",
    apiDomain: process.env.SUPERTOKENS_API_DOMAIN ?? "",
  },
  recipeList: [Session.init()],
});

server.register(formDataParser);
server.register(supertokenPlugin);
server.register(cors, {
  allowedHeaders: ["Content-Type", ...supertokens.getAllCORSHeaders()],
  credentials: true,
});

server.get("/ping", async (req, reply) => {
  return reply
    .code(200)
    .header("Content-Type", "application/json")
    .send({ message: "pong" });
});

server.post<{ Body: CreateDepositIn }>(
  "/deposit",
  { preHandler: verifySession() },
  createDeposit,
);

// route for making payment
server.post<{ Body: SendPaymentIn }>(
  "/send",
  { preHandler: verifySession() },
  sendPayment,
);

server.post<{ Body: WithdrawIn }>(
  "/withdraw",
  { preHandler: verifySession() },
  withdraw,
);

server.get<{
  Querystring: { userId: string; accountId: string };
}>(
  "/transactions",
  { preHandler: apiKeyMiddleware },
  findTransactionByAccountId,
);

server.listen(
  {
    port: process.env.APP_PORT ? Number(process.env.APP_PORT) : 3000,
    host: "0.0.0.0",
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    console.log(`server listening add ${address}`);
  },
);
