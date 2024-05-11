import { FindTransactionByAccountIdOut } from "../model/transaction";
import { TransactionStatus, TransactionType } from "../primitive/transaction";

import env from "@src/config/env";

type FindTransactionsByAccountIdApiResponse = {
  message: string;
  data: {
    id: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    createdAt: string;
  }[];
};

class TransactionRepo {
  private static _instance: TransactionRepo;

  public static getInstance(): TransactionRepo {
    if (!TransactionRepo._instance) {
      TransactionRepo._instance = new TransactionRepo();
    }

    return TransactionRepo._instance;
  }

  public async findTransactionsByAccountId(
    userId: string,
    accountId: string,
  ): Promise<FindTransactionByAccountIdOut> {
    // TODO: call transaction service
    const url = new URL(`${env.TRANSACTION_SERVICE_URI}/transactions`);
    const searchParam = new URLSearchParams();
    searchParam.append("userId", userId);
    searchParam.append("accountId", accountId);

    url.search = searchParam.toString();

    const response = await fetch(url, {
      method: "GET",
      headers: {
        // TODO: put api key here
        "Content-Type": "application/json",
        "x-api-key": env.TRANSACTION_API_KEY ?? "",
      },
    });

    const json =
      (await response.json()) as FindTransactionsByAccountIdApiResponse;

    if (!response.ok) {
      throw new Error(json.message);
    }

    return json.data.map((data) => {
      return {
        id: data.id,
        type: data.type,
        status: data.status,
        amount: data.amount,
        createdAt: data.createdAt,
      };
    });
  }
}

export default TransactionRepo.getInstance();
