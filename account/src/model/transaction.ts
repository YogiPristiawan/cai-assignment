import { TransactionStatus, TransactionType } from "../primitive/transaction";

type Transaction = {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;

  createdAt: string;
};

export type FindTransactionByAccountIdOut = Transaction[];
