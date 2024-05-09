import { AccountType } from "@src/primitive/account";
import { TransactionStatus, TransactionType } from "@src/primitive/transaction";

type Account = {
  id: string;
  type: AccountType;
  name: string;
};

type AccountTransaction = {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;

  createdAt: string;
};

export type FindAccountsByUserIdOut = Account[];

export type GetAccountByIdOut = Account & {
  transactions: AccountTransaction[];
};
