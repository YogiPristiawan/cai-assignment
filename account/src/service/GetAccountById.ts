import { GetAccountByIdOut as AccountModelGetAccountByIdOut } from "../model/account";
import { FindTransactionByAccountIdOut as TrxModelFindTransactionByAccountIdOut } from "../model/transaction";
import { GetAccountByIdOut } from "../dto/account";
import { BadRequestError } from "../primitive/error";

interface IAccountRepo {
  getAccountById(
    userId: string,
    accountId: string,
  ): Promise<AccountModelGetAccountByIdOut>;
}

interface ITransactionRepo {
  findTransactionsByAccountId(
    userId: string,
    accountId: string,
  ): Promise<TrxModelFindTransactionByAccountIdOut>;
}

export default class GetAccountById {
  private _accountRepo: IAccountRepo;
  private _transactionRepo: ITransactionRepo;

  constructor(accountRepo: IAccountRepo, transactionRepo: ITransactionRepo) {
    this._accountRepo = accountRepo;
    this._transactionRepo = transactionRepo;
  }

  public async exec(
    userId: string,
    accountId: string,
  ): Promise<GetAccountByIdOut> {
    if (!accountId) {
      throw new BadRequestError("accountId param is required");
    }

    const account = await this._accountRepo.getAccountById(userId, accountId);

    const transactions =
      await this._transactionRepo.findTransactionsByAccountId(
        userId,
        accountId,
      );

    return {
      id: account.id,
      name: account.name,
      type: account.type,
      lastBalance: account.lastBalance,
      createdAt: account.createdAt,
      transactions: transactions.map((transaction) => {
        return {
          id: transaction.id,
          type: transaction.type,
          status: transaction.status,
          amount: transaction.amount,
          createdAt: transaction.createdAt,
        };
      }),
    };
  }
}
