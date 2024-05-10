import { TransactionStatus, TransactionType } from "../primitive/transaction";

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

export type SendPaymentIn = {
  userId: string;
  amount: number;
  accountId: string;
};

export type SendPaymentOut = {
  transactionId: string;
  amount: number;
  status: TransactionStatus;
};

export type WithdrawIn = {
  userId: string;
  amount: number;
  accountId: string;
};

export type WithdrawOut = {
  transactionId: string;
  amount: number;
  status: TransactionStatus;
};

export type FindTransactionByAccountIdOut = {
  id: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: string;
}[];
