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

  public sendPayment(param: SendPaymentIn): SendPaymentOut {
    // TODO: implement db. make transaction default to pending

    return {
      transactionId: "321",
      amount: 20000,
      status: TransactionStatus.Pending,
    };
  }

  public withdraw(param: WithdrawIn): WithdrawOut {
    // TODO: Implement db. make the teransaction default to pending
    return {
      transactionId: "345",
      amount: 10000,
      status: TransactionStatus.Pending,
    };
  }

  public updateTransactionStatus(param: UpdateTransactionStatusIn): void {}
}

export default TransactionRepo.getInstance();
