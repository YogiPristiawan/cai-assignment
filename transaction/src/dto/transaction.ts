import { TransactionStatus } from "../primitive/transaction";

export type CreateDepositIn = {
  amount: number;
};

export type CreateDepositOut = {
  transactionId: string;
  amount: number;
  status: TransactionStatus;
};
