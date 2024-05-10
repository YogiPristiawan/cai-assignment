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
import { TransactionStatus } from "../primitive/transaction";
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
    try {
      // NOTE: would be better if we send it to MQ instead of synchronous call like this
      await this._accountRepo.sendPayment({
        userId: userId,
        transactionId: transaction.transactionId,
        accountId: payload.accountId,
        amount: payload.amount,
      });

      await this._transactionRepo.updateTransactionStatus({
        transactionId: transaction.transactionId,
        status: "success",
      });
    } catch (err) {
      await this._transactionRepo.updateTransactionStatus({
        transactionId: transaction.transactionId,
        status: "failed",
      });
    }

    return {
      transactionId: transaction.transactionId,
      amount: transaction.amount,
    };
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
