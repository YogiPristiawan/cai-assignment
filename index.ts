import dotenv from "dotenv";
import fastify from "fastify";
import cors from "@fastify/cors";
import formDataParser from "@fastify/formbody";

import SupertokensEmailPassword from "supertokens-node/recipe/emailpassword";
import Session from "supertokens-node/recipe/session";
import { plugin as supertokenPlugin } from "supertokens-node/framework/fastify";
import supertokens from "supertokens-node";

dotenv.config();

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
              console.log("hii i am running");
              let response = await originalImplementation.signUp(input);

              if (
                response.status === "OK" &&
                response.user.loginMethods.length === 1 &&
                input.session === undefined
              ) {
                // TODO: implememnt something
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

server.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(`server listening add ${address}`);
});
