import { FindTransactionByAccountIdOut } from "../model/transaction";
import { TransactionStatus, TransactionType } from "../primitive/transaction";

class TransactionRepo {
  private static _instance: TransactionRepo;

  public static getInstance(): TransactionRepo {
    if (!TransactionRepo._instance) {
      TransactionRepo._instance = new TransactionRepo();
    }

    return TransactionRepo._instance;
  }

  public findTransactionsByAccountId(
    userId: string,
    accountId: string,
  ): FindTransactionByAccountIdOut {
    // TODO: call transaction service

    return [
      {
        id: "123",
        type: TransactionType.Deposit,
        status: TransactionStatus.Success,
        amount: 50000,

        createdAt: "2024-05-05 19:00:00",
      },
      {
        id: "124",
        type: TransactionType.Payment,
        status: TransactionStatus.Success,
        amount: 20000,

        createdAt: "2024-05-05 20:00:00",
      },
      {
        id: "125",
        type: TransactionType.Withdraw,
        status: TransactionStatus.Success,
        amount: 10000,

        createdAt: "2024-05-05 21:00:00",
      },
    ];
  }
}

export default TransactionRepo.getInstance();
