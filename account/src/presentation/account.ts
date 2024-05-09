import { FastifyReply } from "fastify";
import { SessionRequest } from "supertokens-node/lib/build/framework/fastify";
import FindAccountsByUserId from "@src/service/FindAccountsByUserId";
import AccountRepo from "@src/repo/account";

export function findAccounts(req: SessionRequest, res: FastifyReply) {
  try {
    if (!req.session) {
      return res
        .code(401)
        .header("Content-Type", "application/json")
        .send({ message: "unauthorize" });
    }

    let userId = req.session.getUserId();

    const service = new FindAccountsByUserId(AccountRepo);

    const result = service.exec(userId);

    return res.code(200).header("Content-Type", "application/json").send({
      message: "success",
      data: result,
    });
  } catch (err) {
    return res
      .code(500)
      .header("Content-Type", "application/json")
      .send({ message: "Internal server error" });
  }
}
