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

interface ITransactionRepo {
  createDeposit(param: ModelCreateDepositIn): Promise<ModelCreateDepositOut>;
  updateTransactionStatus(param: ModelUpdateTransactionStatusIn): Promise<void>;
}

interface IAccountRepo {
  createDeposit(
    param: AccountModelCreateDepositIn,
  ): Promise<AccountModelCreateDepositOut>;
}

type ProcessTransactionParam = {
  userId: string;
  transactionId: string;
  accountId: string;
  amount: number;
};

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
    const transaction = await this._transactionRepo.createDeposit({
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

  // NOTE: this function contain example of long running process
  private async processTransaction(param: ProcessTransactionParam) {
    try {
      await this._accountRepo.createDeposit({
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

  private validatePayload(payload: CreateDepositIn) {
    if (payload.amount <= 0) {
      throw new BadRequestError("amount must be greater than 0");
    }
    if (!payload.accountId) {
      throw new BadRequestError("accountId is required");
    }
  }
}
