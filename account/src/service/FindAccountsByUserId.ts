import { FindAccountsByUserIdOut } from "@src/dto/account";
import { FindAccountsByUserIdOut as RepoFindAccountByUserIdOut } from "@src/model/account";

interface IAccountRepo {
  findAccountsByUserId(userId: string): Promise<RepoFindAccountByUserIdOut>;
}

export default class FindAccountByUserId {
  private _accountRepo: IAccountRepo;

  constructor(accountRepo: IAccountRepo) {
    this._accountRepo = accountRepo;
  }

  public async exec(userId: string): Promise<FindAccountsByUserIdOut> {
    const accounts = await this._accountRepo.findAccountsByUserId(userId);

    return accounts;
  }
}
