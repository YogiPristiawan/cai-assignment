import fastify from "fastify";

const server = fastify();

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
