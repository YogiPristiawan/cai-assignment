import { CreateDepositIn, CreateDepositOut } from "../model/account";

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
    return new Promise((resolve, reject) => {
      // TODO: call account service
      console.log("Processing for:", param);

      setTimeout(() => {
        console.log("Processed transaction for:", param);
        resolve(param);
      }, 10000);
    });
  }
}

export default AccountRepo.getInstance();
