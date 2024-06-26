import {
  CalculateBalanceIn,
  CreateAccountIn,
  FindAccountsByUserIdOut,
  GetAccountByIdOut,
} from "@src/model/account";

import db from "@src/pkg/prisma";
import { AccountType, Prisma } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestError, NotFoundError } from "@src/primitive/error";
import { TransactionType } from "@src/primitive/transaction";

class AccountRepo {
  private static _instance: AccountRepo;

  private _MAX_RETRIES = 3;

  private _deducTrx: TransactionType[] = [
    TransactionType.Withdraw,
    TransactionType.Payment,
  ];
  private _additionTrx: TransactionType[] = [TransactionType.Deposit];

  public static getInstance(): AccountRepo {
    if (!AccountRepo._instance) {
      AccountRepo._instance = new AccountRepo();
    }

    return AccountRepo._instance;
  }

  public async findAccountsByUserId(
    userId: string,
  ): Promise<FindAccountsByUserIdOut> {
    try {
      const accounts = await db.account.findMany({
        where: {
          userId: userId,
        },
      });

      return accounts.map((account) => {
        return {
          id: account.id,
          type: account.type,
          name: account.name,
          lastBalance: account.lastBalance.toNumber(),
          createdAt: account.createdAt.toISOString(),
        };
      });
    } catch (err) {
      const e = err as Error;
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2015") {
          throw new NotFoundError("record not found");
        }
      }

      throw err;
    }
  }

  public async createAccount(param: CreateAccountIn): Promise<void> {
    await db.account.createMany({
      data: [
        {
          userId: param.userId,
          name: "Debit Account",
          type: "debit",
          lastBalance: 0,
        },
        {
          userId: param.userId,
          name: "Credit Account",
          type: "credit",
          lastBalance: 0,
        },
        {
          userId: param.userId,
          name: "Loan Account",
          type: "loan",
          lastBalance: 0,
        },
      ],
      skipDuplicates: true,
    });
  }

  public async calculateBalance(param: CalculateBalanceIn): Promise<void> {
    let retries = 0;
    while (retries < this._MAX_RETRIES) {
      try {
        await db.$transaction(
          async (tx) => {
            // validate balance
            const balance = await tx.account.findFirst({
              where: {
                id: param.accountId,
              },
              select: {
                lastBalance: true,
              },
            });
            if (!balance) throw new NotFoundError("account not found");

            let amount = param.amount;
            if (this._deducTrx.includes(param.transactionType)) {
              if (balance.lastBalance.toNumber() < param.amount) {
                throw new BadRequestError("insufficient balance");
              }

              amount = -1 * param.amount;
            }

            // insert statement
            await tx.accountStatement.create({
              data: {
                transactionId: param.transactionId,
                accountId: param.accountId,
                userId: param.userId,
                amount: amount,
                transactionType: param.transactionType,
              },
            });

            // update last balance
            await tx.$executeRaw`UPDATE accounts SET "lastBalanceUpdate" = ${new Date()}, "lastBalance" = "lastBalance" + ${amount}, "updatedAt" = ${new Date()} WHERE id = ${param.accountId}:: uuid`;
          },
          {
            isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
          },
        );

        return;
      } catch (err) {
        const e = err as Error;
        if (e instanceof PrismaClientKnownRequestError) {
          if (e.code === "P2015") {
            throw new NotFoundError("record not found");
          }

          if (e.code === "P2034") {
            retries++;
            continue;
          }
        }

        throw err;
      }
    }
  }

  public async getAccountById(
    userId: string,
    accountId: string,
  ): Promise<GetAccountByIdOut> {
    try {
      const account = await db.account.findUnique({
        where: {
          userId: userId,
          id: accountId,
        },
      });

      if (!account) throw new NotFoundError("acount not found");

      return {
        id: account.id,
        type: account.type,
        name: account.name,
        lastBalance: account.lastBalance.toNumber(),
        createdAt: account.createdAt.toISOString(),
      };
    } catch (err) {
      const e = err as Error;
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === "P2015") {
          throw new NotFoundError("record not found");
        }
      }

      throw err;
    }
  }
}

export default AccountRepo.getInstance();
