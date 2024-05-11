import { BalanceProcessingIn, BalanceProcessingOut } from "../dto/account";
import { BadRequestError } from "../primitive/error";
import { CalculateBalanceIn } from "../model/account";

interface IAccountRepo {
  calculateBalance(param: CalculateBalanceIn): Promise<void>;
}

export default class BalanceProcessing {
  private _accountRepo: IAccountRepo;

  constructor(accountRepo: IAccountRepo) {
    this._accountRepo = accountRepo;
  }

  public async exec(
    payload: BalanceProcessingIn,
  ): Promise<BalanceProcessingOut> {
    this.validatePayload(payload);
    await this._accountRepo.calculateBalance({
      transactionId: payload.transactionId,
      userId: payload.userId,
      accountId: payload.accountId,
      amount: payload.amount,
      transactionType: payload.transactionType,
    });

    return payload;
  }

  private validatePayload(payload: BalanceProcessingIn) {
    if (!payload.transactionId) {
      throw new BadRequestError("transactionId is required");
    }
    if (!payload.userId) {
      throw new BadRequestError("userId is required");
    }
    if (!payload.accountId) {
      throw new BadRequestError("accountId payload is required");
    }
    if (payload.amount <= 0) {
      throw new BadRequestError("amount must be greater than 0");
    }
    // TODO: properly validate enum
    if (!payload.transactionType) {
      throw new BadRequestError("transactionType is required");
    }
  }
}
