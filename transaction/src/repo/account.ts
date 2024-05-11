import {
  CreateDepositIn,
  CreateDepositOut,
  SendPaymentIn,
  SendPaymentOut,
  WithdrawIn,
  WithdrawOut,
} from "../model/account";
import env from "@src/config/env";

class AccountRepo {
  private static _instance: AccountRepo;

  public static getInstance(): AccountRepo {
    if (!AccountRepo._instance) {
      AccountRepo._instance = new AccountRepo();
    }

    return AccountRepo._instance;
  }

  public async createDeposit(
    param: CreateDepositIn,
  ): Promise<CreateDepositOut> {
    // WARN: imagine long running process here
    console.log("processing transaction", param);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 10000);
    });

    const url = `${env.ACCOUNT_SERVICE_URI}/balance-processing`;
    const payload = {
      userId: param.userId,
      transactionId: param.transactionId,
      accountId: param.accountId,
      amount: param.amount,
      transactionType: "deposit",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        // TODO: put api key here
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = (await response.json()) as { message: string };

    if (!response.ok) {
      throw new Error(json.message);
    }
    console.log("transaction processed successfully", param);

    return param;
  }

  public async sendPayment(param: SendPaymentIn): Promise<SendPaymentOut> {
    // WARN: imagine long running process here
    console.log("processing transaction", param);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 10000);
    });

    const url = `${env.ACCOUNT_SERVICE_URI}/balance-processing`;
    const payload = {
      userId: param.userId,
      transactionId: param.transactionId,
      accountId: param.accountId,
      amount: param.amount,
      transactionType: "payment",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        // TODO: put api key here
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = (await response.json()) as { message: string };

    if (!response.ok) {
      throw new Error(json.message);
    }
    console.log("transaction processed successfully", param);

    return param;
  }

  public async withdraw(param: WithdrawIn): Promise<WithdrawOut> {
    // WARN: imagine long running process here
    console.log("processing transaction", param);
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 10000);
    });

    const url = `${env.ACCOUNT_SERVICE_URI}/balance-processing`;
    const payload = {
      userId: param.userId,
      transactionId: param.transactionId,
      accountId: param.accountId,
      amount: param.amount,
      transactionType: "withdraw",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        // TODO: put api key here
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const json = (await response.json()) as { message: string };

    if (!response.ok) {
      throw new Error(json.message);
    }

    console.log("transaction processed successfully", param);

    return param;
  }
}

export default AccountRepo.getInstance();
