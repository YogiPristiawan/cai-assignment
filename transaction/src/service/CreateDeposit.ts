import {
  CreateDepositIn as ModelCreateDepositIn,
  CreateDepositOut as ModelCreateDepositOut,
  UpdateTransactionStatusIn as ModelUpdateTransactionStatusIn,
} from "@src/model/transaction";

import {
  CreateDepositIn as AccountModelCreateDepositIn,
  CreateDepositOut as AccountModelCreateDepositOut,
} from "@src/model/account";
import { CreateDepositIn, CreateDepositOut } from "@src/dto/transaction";
import { BadRequestError } from "../primitive/error";
import { TransactionStatus } from "@src/primitive/transaction";

interface ITransactionRepo {
  createDeposit(param: ModelCreateDepositIn): ModelCreateDepositOut;
  updateTransactionStatus(param: ModelUpdateTransactionStatusIn): void;
}

interface IAccountRepo {
  createDeposit(
    param: AccountModelCreateDepositIn,
  ): Promise<AccountModelCreateDepositOut>;
}

export default class CreateDeposit {
  private _transactionRepo: ITransactionRepo;
  private _accountRepo: IAccountRepo;

  constructor(transactionRepo: ITransactionRepo, accountRepo: IAccountRepo) {
    this._transactionRepo = transactionRepo;
    this._accountRepo = accountRepo;
  }

  public async exec(
    userId: string,
    payload: CreateDepositIn,
  ): Promise<CreateDepositOut> {
    this.validatePayload(payload);

    // save transaction
    const transaction = this._transactionRepo.createDeposit({
      userId: userId,
      accountId: payload.accountId,
      amount: payload.amount,
    });

    // call account service
    try {
      // NOTE: would be better if we send to MQ instead of synchronous call like this
      await this._accountRepo.createDeposit({
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
      status: transaction.status,
    };
  }

  private validatePayload(payload: CreateDepositIn) {
    if (payload.amount <= 0) {
      throw new BadRequestError("amount must be greater than 0");
    }
    if (!payload.accountId) {
      throw new BadRequestError("accountId is required");
    }
  }
}
