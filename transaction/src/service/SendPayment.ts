import {
  SendPaymentIn as TrxModelSendPaymentIn,
  SendPaymentOut as TrxModelSendPaymentOut,
  UpdateTransactionStatusIn,
} from "../model/transaction";
import {
  SendPaymentIn as AccountModelSendPaymentIn,
  SendPaymentOut as AccountModelSendPaymentOut,
} from "../model/account";
import { SendPaymentIn, SendPaymentOut } from "../dto/transaction";
import { BadRequestError } from "@src/primitive/error";

interface ITransactionRepo {
  sendPayment(param: TrxModelSendPaymentIn): Promise<TrxModelSendPaymentOut>;
  updateTransactionStatus(param: UpdateTransactionStatusIn): Promise<void>;
}

interface IAccountRepo {
  sendPayment(
    param: AccountModelSendPaymentIn,
  ): Promise<AccountModelSendPaymentOut>;
}

type ProcessTransactionParam = {
  userId: string;
  transactionId: string;
  accountId: string;
  amount: number;
};

export default class SendPayment {
  private _transactionRepo: ITransactionRepo;
  private _accountRepo: IAccountRepo;

  constructor(transactionRepo: ITransactionRepo, accountRepo: IAccountRepo) {
    this._transactionRepo = transactionRepo;
    this._accountRepo = accountRepo;
  }

  public async exec(
    userId: string,
    payload: SendPaymentIn,
  ): Promise<SendPaymentOut> {
    this.validatePayload(payload);

    // make transaction
    const transaction = await this._transactionRepo.sendPayment({
      userId: userId,
      amount: payload.amount,
      accountId: payload.accountId,
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
      await this._accountRepo.sendPayment({
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

  private validatePayload(payload: SendPaymentIn) {
    if (!payload.accountId) {
      throw new BadRequestError("accountId is required");
    }
    if (payload.amount <= 0) {
      throw new BadRequestError("amount must be greater than 0");
    }
  }
}
