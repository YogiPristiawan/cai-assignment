import { FindTransactionByAccountIdOut as TrxModelFindTransactionByAccountIdOut } from "../model/transaction";
import { FindTransactionByAccountIdOut } from "../dto/transaction";

interface ITransactionRepo {
  findTransactionByAccountId(
    userId: string,
    accountId: string,
  ): Promise<TrxModelFindTransactionByAccountIdOut>;
}

export default class FindTransactionByAccountId {
  private _transactionRepo: ITransactionRepo;

  constructor(transactionRepo: ITransactionRepo) {
    this._transactionRepo = transactionRepo;
  }

  public async exec(
    userId: string,
    accountId: string,
  ): Promise<FindTransactionByAccountIdOut> {
    // TODO: validate uuid
    if (!userId || !accountId) {
      return [];
    }

    const transactions = await this._transactionRepo.findTransactionByAccountId(
      userId,
      accountId,
    );

    return transactions.map((transaction) => {
      return {
        id: transaction.id,
        amount: transaction.amount,
        type: transaction.type,
        status: transaction.status,
        createdAt: transaction.createdAt,
      };
    });
  }
}
