-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('debit', 'credit', 'loan');

-- CreateEnum
CREATE TYPE "AccountStatementTransactionType" AS ENUM ('deposit', 'payment', 'withdraw');

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "name" VARCHAR(63) NOT NULL,
    "type" "AccountType" NOT NULL,
    "lastBalance" DECIMAL(65,30) NOT NULL,
    "lastBalanceUpdate" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account_statements" (
    "incr" BIGSERIAL NOT NULL,
    "id" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "accountId" UUID NOT NULL,
    "transactionType" "AccountStatementTransactionType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_statements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "accounts_userId_idx" ON "accounts"("userId");

-- CreateIndex
CREATE INDEX "accounts_type_idx" ON "accounts"("type");

-- CreateIndex
CREATE INDEX "accounts_createdAt_idx" ON "accounts"("createdAt");

-- CreateIndex
CREATE INDEX "account_statements_incr_idx" ON "account_statements"("incr");

-- CreateIndex
CREATE INDEX "account_statements_userId_idx" ON "account_statements"("userId");

-- CreateIndex
CREATE INDEX "account_statements_accountId_idx" ON "account_statements"("accountId");

-- CreateIndex
CREATE INDEX "account_statements_transactionType_idx" ON "account_statements"("transactionType");

-- CreateIndex
CREATE INDEX "account_statements_createdAt_idx" ON "account_statements"("createdAt");

-- AddForeignKey
ALTER TABLE "account_statements" ADD CONSTRAINT "account_statements_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
