import {
  CreateAccountIn,
  CreateAccountOut,
  FindAccountsByUserIdOut,
  GetAccountByIdOut,
} from "@src/model/account";
import { AccountType } from "@src/primitive/account";

class AccountRepo {
  private static _instance: AccountRepo;

  public static getInstance(): AccountRepo {
    if (!AccountRepo._instance) {
      AccountRepo._instance = new AccountRepo();
    }

    return AccountRepo._instance;
  }

  public findAccountsByUserId(userId: string): FindAccountsByUserIdOut {
    // TODO: implement db
    return [
      {
        id: "123",
        name: "Debit",
        type: AccountType.Debit,
      },
      {
        id: "234",
        name: "Credit",
        type: AccountType.Credit,
      },
      {
        id: "345",
        name: "Loan",
        type: AccountType.Loan,
      },
    ];
  }

  public createAccount(param: CreateAccountIn): CreateAccountOut {
    // TODO: implement db
    return [
      {
        id: "123",
        name: "Debit",
        type: AccountType.Debit,
      },
      {
        id: "234",
        name: "Credit",
        type: AccountType.Credit,
      },
      {
        id: "345",
        name: "Loan",
        type: AccountType.Loan,
      },
    ];
  }

  public getAccountById(userId: string, accountId: string): GetAccountByIdOut {
    // TODO: implement db
    return {
      id: "123",
      name: "Mock",
      type: AccountType.Debit,
    };
  }
}

export default AccountRepo.getInstance();
