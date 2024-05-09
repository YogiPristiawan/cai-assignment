import { TransactionStatus, TransactionType } from "../primitive/transaction";

export type CreateDepositIn = {
  amount: number;
  accountId: string;
};

export type CreateDepositOut = {
  transactionId: string;
  amount: number;
  status: TransactionStatus;
};

export type SendPaymentIn = {
  amount: number;
  accountId: string;
};

export type SendPaymentOut = {
  transactionId: string;
  amount: number;
  status: TransactionStatus;
};
