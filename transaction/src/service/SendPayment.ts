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

interface ITransactionRepo {
  sendPayment(param: TrxModelSendPaymentIn): TrxModelSendPaymentOut;
  updateTransactionStatus(param: UpdateTransactionStatusIn): void;
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

  public async exec(userId: string, payload: SendPaymentIn) {
    // make transaction
    const transaction = this._transactionRepo.sendPayment({
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
  }
}
