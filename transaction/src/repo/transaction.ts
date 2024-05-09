import {
  CreateDepositIn,
  CreateDepositOut,
  SendPaymentIn,
  SendPaymentOut,
  UpdateTransactionStatusIn,
  WithdrawIn,
  WithdrawOut,
} from "@src/model/transaction";
import { TransactionStatus } from "@src/primitive/transaction";

import db from "@src/pkg/prisma";

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

  public sendPayment(param: SendPaymentIn): SendPaymentOut {
    // TODO: implement db. make transaction default to pending

    return {
      transactionId: "321",
      amount: 20000,
      status: "pending",
    };
  }

  public withdraw(param: WithdrawIn): WithdrawOut {
    // TODO: Implement db. make the teransaction default to pending
    return {
      transactionId: "345",
      amount: 10000,
      status: "pending",
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
}

export default TransactionRepo.getInstance();
