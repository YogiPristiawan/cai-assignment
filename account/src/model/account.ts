import { AccountType } from "@src/primitive/account";

type Account = {
  id: string;
  type: AccountType;
  name: string;
};

export type FindAccountsByUserIdOut = Account[];

export type CreateAccountIn = {
  userId: string;
};

export type CreateAccountOut = Account[];
