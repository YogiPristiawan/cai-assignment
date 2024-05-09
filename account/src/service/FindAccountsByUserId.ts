import { FindAccountsByUserIdOut } from "@src/dto/account";
import { FindAccountsByUserIdOut as RepoFindAccountByUserIdOut } from "@src/model/account";

interface IAccountRepo {
  findAccountsByUserId(userId: string): RepoFindAccountByUserIdOut;
}

export default class FindAccountByUserId {
  private _accountRepo: IAccountRepo;

  constructor(accountRepo: IAccountRepo) {
    this._accountRepo = accountRepo;
  }

  public exec(userId: string): FindAccountsByUserIdOut {
    const accounts = this._accountRepo.findAccountsByUserId(userId);

    return accounts;
  }
}
