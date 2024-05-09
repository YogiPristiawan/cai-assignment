import {
  WithdrawIn as AccountModelWithdrawIn,
  WithdrawOut as AccountModelWithdrawOut,
} from "../model/account";

import {
  WithdrawIn as TrxModelWithdrawIn,
  WithdrawOut as TrxModelWithdrawOut,
  UpdateTransactionStatusIn,
} from "../model/transaction";

import { BadRequestError } from "../primitive/error";

import { WithdrawIn, WithdrawOut } from "../dto/transaction";
import { TransactionStatus } from "../primitive/transaction";

interface ITransactionRepo {
  withdraw(param: TrxModelWithdrawIn): TrxModelWithdrawOut;
  updateTransactionStatus(param: UpdateTransactionStatusIn): void;
}

interface IAccountRepo {
  withdraw(param: AccountModelWithdrawIn): Promise<AccountModelWithdrawOut>;
}

export default class Withdraw {
  private _transactionRepo: ITransactionRepo;
  private _accountRepo: IAccountRepo;

  constructor(transactionRepo: ITransactionRepo, accountRepo: IAccountRepo) {
    this._transactionRepo = transactionRepo;
    this._accountRepo = accountRepo;
  }

  public async exec(userId: string, payload: WithdrawIn): Promise<WithdrawOut> {
    this.validatePayload(payload);

    const transaction = this._transactionRepo.withdraw({
      userId: userId,
      accountId: payload.accountId,
      amount: payload.amount,
    });

    try {
      // NOTE: would be better if we send it to MQ instead of synchronous call like this
      await this._accountRepo.withdraw({
        userId: userId,
        transactionId: transaction.transactionId,
        accountId: payload.accountId,
        amount: payload.amount,
      });

      this._transactionRepo.updateTransactionStatus({
        transactionId: transaction.transactionId,
        status: TransactionStatus.Success,
      });
    } catch (err) {
      this._transactionRepo.updateTransactionStatus({
        transactionId: transaction.transactionId,
        status: TransactionStatus.Failed,
      });
    }

    return {
      transactionId: transaction.transactionId,
      amount: transaction.amount,
    };
  }

  private validatePayload(payload: WithdrawIn) {
    if (!payload.accountId) {
      throw new BadRequestError("accountId is required");
    }
    if (payload.amount <= 0) {
      throw new BadRequestError("amount must be greater than 0");
    }
  }
}
