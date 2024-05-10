import {
  TransactionStatus as PrismaTransactionStatus,
  TransactionType as PrismaTransactionType,
} from "@prisma/client";

export type TransactionStatus = PrismaTransactionStatus;

export type TransactionType = PrismaTransactionType;
