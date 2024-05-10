import { AccountType } from "@src/primitive/account";
import { TransactionType } from "@src/primitive/transaction";

type Account = {
  id: string;
  type: AccountType;
  name: string;
  lastBalance: number;
  createdAt: string;
};

export type FindAccountsByUserIdOut = Account[];

export type CreateAccountIn = {
  userId: string;
};

// export type CreateAccountOut = Account[];

export type GetAccountByIdOut = Account;

export type CalculateBalanceIn = {
  userId: string;
  transactionId: string;
  accountId: string;
  amount: number;
  transactionType: TransactionType;
};
