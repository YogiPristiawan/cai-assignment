import fastify from "fastify";
import cors from "@fastify/cors";
import formDataParser from "@fastify/formbody";

if (process.env.NODE_ENV === "development") {
  import("dotenv").then((dotenv) => {
    dotenv.config();
  });
}

import {
  balanceProcessing,
  findAccounts,
  getAccountById,
} from "@src/presentation/account";

import apiKeyMiddleware from "@src/middleware/apiKey";

import AccountRepo from "@src/repo/account";
import CreateAccount from "@src/service/CreateAccount";

import SupertokensEmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { plugin as supertokenPlugin } from "supertokens-node/framework/fastify";
import supertokens from "supertokens-node";
import { verifySession } from "supertokens-node/recipe/session/framework/fastify";
import { BalanceProcessingIn } from "@src/dto/account";

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
  recipeList: [
    SupertokensEmailPassword.init({
      override: {
        functions: (originalImplementation) => {
          return {
            ...originalImplementation,
            signUp: async function (input) {
              let response = await originalImplementation.signUp(input);

              if (
                response.status === "OK" &&
                response.user.loginMethods.length === 1 &&
                input.session === undefined
              ) {
                const service = new CreateAccount(AccountRepo);
                await service.exec(response.user);
              }

              return response;
            },
          };
        },
      },
    }),

    Session.init(),
  ],
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

server.get("/accounts", { preHandler: verifySession() }, findAccounts);

server.get<{ Params: { accountId: string } }>(
  "/accounts/:accountId",
  { preHandler: verifySession() },
  getAccountById,
);

server.post<{ Body: BalanceProcessingIn }>(
  "/balance-processing",
  { preHandler: apiKeyMiddleware },
  // TODO: middleware
  balanceProcessing,
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
