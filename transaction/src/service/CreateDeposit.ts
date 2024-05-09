import {
  CreateDepositIn as ModelCreateDepositIn,
  CreateDepositOut as ModelCreateDepositOut,
} from "@src/model/transaction";
import { CreateDepositIn, CreateDepositOut } from "@src/dto/transaction";
import { BadRequestError } from "../primitive/error";

interface ITransactionRepo {
  createDeposit(param: ModelCreateDepositIn): ModelCreateDepositOut;
}

export default class CreateDeposit {
  private _transactionRepo: ITransactionRepo;

  constructor(transactionRepo: ITransactionRepo) {
    this._transactionRepo = transactionRepo;
  }

  public exec(userId: string, payload: CreateDepositIn): CreateDepositOut {
    this.validatePayload(payload);

    const transaction = this._transactionRepo.createDeposit({
      userId: userId,
      amount: payload.amount,
    });

    return {
      transactionId: transaction.transactionId,
      amount: transaction.amount,
      status: transaction.status,
    };
  }

  // TODO: implement me
  private validatePayload(payload: CreateDepositIn) {
    if (payload.amount <= 0) {
      throw new BadRequestError("amount must be greater than 0");
    }
  }
}
