import {
  CreateAccountIn,
  CreateAccountOut,
  FindAccountsByUserIdOut,
} from "@src/model/account";

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
        type: 1,
      },
      {
        id: "234",
        name: "Credit",
        type: 2,
      },
      {
        id: "345",
        name: "Loan",
        type: 3,
      },
    ];
  }

  public createAccount(param: CreateAccountIn): CreateAccountOut {
    // TODO: implement db
    return [
      {
        id: "123",
        name: "Debit",
        type: 1,
      },
      {
        id: "234",
        name: "Credit",
        type: 2,
      },
      {
        id: "345",
        name: "Loan",
        type: 3,
      },
    ];
  }
}

export default AccountRepo.getInstance();
