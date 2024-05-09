import { GetAccountByIdOut as AccountModelGetAccountByIdOut } from "../model/account";
import { FindTransactionByAccountIdOut as TrxModelFindTransactionByAccountIdOut } from "../model/transaction";
import { GetAccountByIdOut } from "../dto/account";
import { BadRequestError } from "../primitive/error";

interface IAccountRepo {
  getAccountById(
    userId: string,
    accountId: string,
  ): AccountModelGetAccountByIdOut;
}

interface ITransactionRepo {
  findTransactionsByAccountId(
    userId: string,
    accountId: string,
  ): TrxModelFindTransactionByAccountIdOut;
}

export default class GetAccountById {
  private _accountRepo: IAccountRepo;
  private _transactionRepo: ITransactionRepo;

  constructor(accountRepo: IAccountRepo, transactionRepo: ITransactionRepo) {
    this._accountRepo = accountRepo;
    this._transactionRepo = transactionRepo;
  }

  public exec(userId: string, accountId: string): GetAccountByIdOut {
    if (!accountId) {
      throw new BadRequestError("accountId param is required");
    }

    const account = this._accountRepo.getAccountById(userId, accountId);

    const transactions = this._transactionRepo.findTransactionsByAccountId(
      userId,
      accountId,
    );

    return {
      id: account.id,
      name: account.name,
      type: account.type,
      transactions: transactions,
    };
  }
}
