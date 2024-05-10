import { AccountType } from "@src/primitive/account";

type Account = {
  id: string;
  type: AccountType;
  name: string;
  last_balance: number;
};

export type FindAccountsByUserIdOut = Account[];

export type CreateAccountIn = {
  userId: string;
};

// export type CreateAccountOut = Account[];

export type GetAccountByIdOut = Account;
