export type CreateDepositIn = {
  userId: string;
  transactionId: string;
  accountId: string;
  amount: number;
};

export type CreateDepositOut = CreateDepositIn;
