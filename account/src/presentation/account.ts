import { FastifyReply, FastifyRequest } from "fastify";
import { SessionRequest } from "supertokens-node/lib/build/framework/fastify";
import { HttpError } from "../primitive/error";

import FindAccountsByUserId from "@src/service/FindAccountsByUserId";
import GetAccountById from "@src/service/GetAccountById";
import BalanceProcessing from "@src/service/BalanceProcessing";

import AccountRepo from "@src/repo/account";
import TransactionRepo from "@src/repo/transactions";
import { BalanceProcessingIn } from "@src/dto/account";

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

export function getAccountById(
  req: SessionRequest<FastifyRequest<{ Params: { accountId: string } }>>,
  res: FastifyReply,
) {
  try {
    if (!req.session) {
      return res
        .code(401)
        .header("Content-Type", "application/json")
        .send({ message: "unauthorize" });
    }

    const userId = req.session.getUserId();
    const accountId = req.params.accountId;

    const service = new GetAccountById(AccountRepo, TransactionRepo);
    const result = service.exec(userId, accountId);

    return res
      .code(200)
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

    console.log(e);

    return res
      .code(500)
      .header("Content-Type", "application/json")
      .send({ message: "internal server error" });
  }
}

export async function balanceProcessing(
  req: SessionRequest<FastifyRequest<{ Body: BalanceProcessingIn }>>,
  res: FastifyReply,
) {
  try {
    if (!req.body) {
      return res
        .code(400)
        .header("Content-Type", "application/json")
        .send({ message: "body is required" });
    }

    const service = new BalanceProcessing(AccountRepo);
    const result = await service.exec({
      transactionId: req.body.transactionId ?? "",
      userId: req.body.userId ?? "",
      accountId: req.body.accountId ?? "",
      amount: req.body.amount,
      transactionType: req.body.transactionType,
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
        .send({ messaeg: e.message });
    }

    console.log(e);

    return res
      .code(500)
      .header("Content-Type", "application/json")
      .send({ message: "internal server error" });
  }
}
