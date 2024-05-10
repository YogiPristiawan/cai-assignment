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
    console.log("processing");
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 10000);
    });

    console.log("send to account service");
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

    return param;

    // return new Promise((resolve, reject) => {
    //   console.log("Processing for:", param);
    //
    //   setTimeout(() => {
    //     console.log("Processed transaction for:", param);
    //     resolve(param);
    //   }, 10000);
    // });
  }

  public async sendPayment(param: SendPaymentIn): Promise<SendPaymentOut> {
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

    return param;

    // return new Promise((resolve, reject) => {
    //   console.log("Processing for:", param);
    //
    //   setTimeout(() => {
    //     console.log("Processed transaction for:", param);
    //     resolve(param);
    //   }, 10000);
    // });
  }

  public async withdraw(param: WithdrawIn): Promise<WithdrawOut> {
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

    return param;

    // return new Promise((resolve, reject) => {
    //   console.log("Processing for:", param);
    //
    //   setTimeout(() => {
    //     console.log("Processed transaction for:", param);
    //     resolve(param);
    //   }, 10000);
    // });
  }
}

export default AccountRepo.getInstance();
