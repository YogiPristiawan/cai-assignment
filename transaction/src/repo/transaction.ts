import {
  CreateDepositIn,
  CreateDepositOut,
  UpdateTransactionStatusIn,
} from "@src/model/transaction";
import { TransactionStatus } from "@src/primitive/transaction";

class TransactionRepo {
  private static _instance: TransactionRepo;

  public static getInstance(): TransactionRepo {
    if (!TransactionRepo._instance) {
      TransactionRepo._instance = new TransactionRepo();
    }

    return TransactionRepo._instance;
  }

  public createDeposit(param: CreateDepositIn): CreateDepositOut {
    // TODO: implement db. make transaction as pending
    return {
      transactionId: "123",
      amount: 500000,
      status: TransactionStatus.Pending,
    };
  }

  public updateTransactionStatus(param: UpdateTransactionStatusIn): void {}
}

export default TransactionRepo.getInstance();
