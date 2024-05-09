import { TransactionStatus } from "../primitive/transaction";

export type CreateDepositIn = {
  userId: string;
  amount: number;
  accountId: string;
};

export type CreateDepositOut = {
  transactionId: string;
  amount: number;
  status: TransactionStatus;
};

export type UpdateTransactionStatusIn = {
  transactionId: string;
  status: TransactionStatus;
};
