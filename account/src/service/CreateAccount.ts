import { User } from "supertokens-node/lib/build/types";
import {
  CreateAccountIn as ModelCreateAccountIn,
  CreateAccountOut as ModelCreateAccountOut,
} from "@src/model/account";

// interface can be used for mocking purpose
interface IAccountRepo {
  createAccount(param: ModelCreateAccountIn): ModelCreateAccountOut;
}

type CreateAccountIn = User;

export default class CreateAccount {
  private _accountRepo: IAccountRepo;

  constructor(accountRepo: IAccountRepo) {
    this._accountRepo = accountRepo;
  }

  public exec(param: CreateAccountIn) {
    const createdAccounts = this._accountRepo.createAccount({
      userId: param.id,
    });
  }
}
