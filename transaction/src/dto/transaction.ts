import {
  TransactionAccountType,
  TransactionStatus,
} from "../primitive/transaction";

export type CreateDepositIn = {
  amount: number;
  accountId: string;
};

export type CreateDepositOut = {
  transactionId: string;
  amount: number;
  status: TransactionStatus;
};
