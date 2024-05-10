import {
  CreateDepositIn,
  CreateDepositOut,
  FindTransactionByAccountIdOut,
  SendPaymentIn,
  SendPaymentOut,
  UpdateTransactionStatusIn,
  WithdrawIn,
  WithdrawOut,
} from "@src/model/transaction";
import { TransactionStatus } from "@src/primitive/transaction";

import db from "@src/pkg/prisma";
import { HttpError, NotFoundError } from "@src/primitive/error";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

class TransactionRepo {
  private static _instance: TransactionRepo;

  public static getInstance(): TransactionRepo {
    if (!TransactionRepo._instance) {
      TransactionRepo._instance = new TransactionRepo();
    }

    return TransactionRepo._instance;
  }

  public async createDeposit(
    param: CreateDepositIn,
  ): Promise<CreateDepositOut> {
    const createdDeposit = await db.transaction.create({
      data: {
        userId: param.userId,
        accountId: param.accountId,
        status: "pending",
        type: "deposit",
        amount: param.amount,
      },
    });

    return {
      transactionId: createdDeposit.id,
      amount: createdDeposit.amount.toNumber(),
      status: createdDeposit.status,
    };
  }

  public async sendPayment(param: SendPaymentIn): Promise<SendPaymentOut> {
    const createdPayment = await db.transaction.create({
      data: {
        userId: param.userId,
        accountId: param.accountId,
        status: "pending",
        type: "payment",
        amount: param.amount,
      },
    });

    return {
      transactionId: createdPayment.id,
      amount: createdPayment.amount.toNumber(),
      status: createdPayment.status,
    };
  }

  public async withdraw(param: WithdrawIn): Promise<WithdrawOut> {
    const createdWithdraw = await db.transaction.create({
      data: {
        userId: param.userId,
        accountId: param.accountId,
        status: "pending",
        type: "withdraw",
        amount: param.amount,
      },
    });

    return {
      transactionId: createdWithdraw.id,
      amount: createdWithdraw.amount.toNumber(),
      status: createdWithdraw.status,
    };
  }

  public async updateTransactionStatus(
    param: UpdateTransactionStatusIn,
  ): Promise<void> {
    await db.transaction.update({
      where: {
        id: param.transactionId,
      },
      data: {
        status: param.status,
      },
    });
  }

  public async findTransactionByAccountId(
    userId: string,
    accountId: string,
  ): Promise<FindTransactionByAccountIdOut> {
    try {
      // TODO: pagination
      const transactions = await db.transaction.findMany({
        where: {
          userId: userId,
          accountId: accountId,
        },
        orderBy: {
          incr: "desc",
        },
      });

      return transactions.map((transaction) => {
        return {
          id: transaction.id,
          amount: transaction.amount.toNumber(),
          type: transaction.type,
          status: transaction.status,
          createdAt: transaction.createdAt.toISOString(),
        };
      });
    } catch (err) {
      const e = err as Error;
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2015") {
          return [];
        }
      }

      throw err;
    }
  }
}

export default TransactionRepo.getInstance();
