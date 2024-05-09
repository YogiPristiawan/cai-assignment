import { FastifyReply, FastifyRequest } from "fastify";
import { SessionRequest } from "supertokens-node/lib/build/framework/fastify";
import CreateDeposit from "../service/CreateDeposit";

import TransactionRepo from "../repo/transaction";
import AccountRepo from "../repo/account";

import { CreateDepositIn } from "../dto/transaction";
import { HttpError } from "../primitive/error";

export async function createDeposit(
  req: SessionRequest<FastifyRequest<{ Body: CreateDepositIn }>>,
  res: FastifyReply,
) {
  try {
    if (!req.session) {
      return res
        .code(401)
        .header("Content-Type", "application/json")
        .send({ message: "unauthorize" });
    }
    if (!req.body) {
      return res
        .code(400)
        .header("Content-Type", "application/json")
        .send({ message: "body is required" });
    }
    const userId = req.session.getUserId();

    const service = new CreateDeposit(TransactionRepo, AccountRepo);
    const result = await service.exec(userId, {
      amount: req.body.amount,
      accountId: req.body.accountId,
    });

    return res
      .code(201)
      .header("Content-Type", "application/json")
      .send({ message: "success", data: result });
  } catch (err) {
    const e = err as Error;
    if (e instanceof HttpError) {
      return res
        .code(e.statusCode)
        .header("Content-Type", "application/json")
        .send({ message: e.message });
    }

    console.log(err);

    return res
      .code(500)
      .header("Content-Type", "application/json")
      .send({ message: "internal server error" });
  }
}
