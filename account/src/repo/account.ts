import {
  CreateAccountIn,
  FindAccountsByUserIdOut,
  GetAccountByIdOut,
} from "@src/model/account";
import { AccountType } from "@src/primitive/account";

import db from "@src/pkg/prisma";

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
        last_balance: 0,
      },
      {
        id: "234",
        name: "Credit",
        type: AccountType.Credit,
        last_balance: 0,
      },
      {
        id: "345",
        name: "Loan",
        type: AccountType.Loan,
        last_balance: 0,
      },
    ];
  }

  public async createAccount(param: CreateAccountIn): Promise<void> {
    await db.account.createMany({
      data: [
        {
          userId: param.userId,
          name: "Debit Account",
          type: "debit",
          last_balance: 0,
        },
        {
          userId: param.userId,
          name: "Credit Account",
          type: "credit",
          last_balance: 0,
        },
        {
          userId: param.userId,
          name: "Loan Account",
          type: "loan",
          last_balance: 0,
        },
      ],
      skipDuplicates: true,
    });
  }

  public getAccountById(userId: string, accountId: string): GetAccountByIdOut {
    // TODO: implement db
    return {
      id: "123",
      name: "Mock",
      type: AccountType.Debit,
      last_balance: 0,
    };
  }
}

export default AccountRepo.getInstance();
