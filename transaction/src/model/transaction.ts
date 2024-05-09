import { TransactionStatus } from "../primitive/transaction";

export type CreateDepositIn = {
  userId: string;
  amount: number;
};

export type CreateDepositOut = {
  transactionId: string;
  amount: number;
  status: TransactionStatus;
};
