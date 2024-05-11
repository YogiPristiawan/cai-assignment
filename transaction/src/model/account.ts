export type CreateDepositIn = {
  userId: string;
  transactionId: string;
  accountId: string;
  amount: number;
};

export type CreateDepositOut = CreateDepositIn;

export type SendPaymentIn = {
  userId: string;
  transactionId: string;
  accountId: string;
  amount: number;
};

export type SendPaymentOut = SendPaymentIn;

export type WithdrawIn = {
  userId: string;
  transactionId: string;
  accountId: string;
  amount: number;
};

export type WithdrawOut = WithdrawIn;
