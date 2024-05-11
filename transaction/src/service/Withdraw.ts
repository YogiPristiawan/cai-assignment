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
  withdraw(param: TrxModelWithdrawIn): Promise<TrxModelWithdrawOut>;
  updateTransactionStatus(param: UpdateTransactionStatusIn): Promise<void>;
}

interface IAccountRepo {
  withdraw(param: AccountModelWithdrawIn): Promise<AccountModelWithdrawOut>;
}

type ProcessTransactionParam = {
  userId: string;
  transactionId: string;
  accountId: string;
  amount: number;
};

export default class Withdraw {
  private _transactionRepo: ITransactionRepo;
  private _accountRepo: IAccountRepo;

  constructor(transactionRepo: ITransactionRepo, accountRepo: IAccountRepo) {
    this._transactionRepo = transactionRepo;
    this._accountRepo = accountRepo;
  }

  public async exec(userId: string, payload: WithdrawIn): Promise<WithdrawOut> {
    this.validatePayload(payload);

    const transaction = await this._transactionRepo.withdraw({
      userId: userId,
      accountId: payload.accountId,
      amount: payload.amount,
    });

    // call account service
    // NOTE: would be better if we send long running process like this to MQ instead of using asynchronous functions call like this
    this.processTransaction({
      userId: userId,
      transactionId: transaction.transactionId,
      accountId: payload.accountId,
      amount: payload.amount,
    });

    return {
      transactionId: transaction.transactionId,
      amount: transaction.amount,
    };
  }

  private async processTransaction(param: ProcessTransactionParam) {
    try {
      await this._accountRepo.withdraw({
        userId: param.userId,
        transactionId: param.transactionId,
        accountId: param.accountId,
        amount: param.amount,
      });

      await this._transactionRepo.updateTransactionStatus({
        transactionId: param.transactionId,
        status: "success",
      });
    } catch (err) {
      await this._transactionRepo.updateTransactionStatus({
        transactionId: param.transactionId,
        status: "failed",
      });
    }
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
