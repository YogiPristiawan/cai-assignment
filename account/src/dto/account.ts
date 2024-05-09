import { AccountType } from "@src/primitive/account";

type Account = {
  id: string;
  type: AccountType;
  name: string;
};

export type FindAccountsByUserIdOut = Account[];
