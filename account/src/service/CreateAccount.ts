import { User } from "supertokens-node/lib/build/types";
import { CreateAccountIn as ModelCreateAccountIn } from "@src/model/account";

// interface can be used for mocking purpose
interface IAccountRepo {
  createAccount(param: ModelCreateAccountIn): Promise<void>;
}

type CreateAccountIn = User;

export default class CreateAccount {
  private _accountRepo: IAccountRepo;

  constructor(accountRepo: IAccountRepo) {
    this._accountRepo = accountRepo;
  }

  public async exec(param: CreateAccountIn) {
    await this._accountRepo.createAccount({
      userId: param.id,
    });
  }
}
