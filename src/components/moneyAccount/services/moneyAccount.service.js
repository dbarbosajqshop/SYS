import MoneyAccount from '../schemas/moneyAccount.schema.js'

export default class MoneyAccountService{
  static async findByUser(UserId) {
    const moneyAccount = await MoneyAccount.findOne({ UserId });
    if(!moneyAccount) { 
      throw new Error('Nenhuma conta encontrada vinculada ao usuário.');
    }
    return moneyAccount;
  }

  static async createUserMoneyAccount(UserId, createdBy){
    const userHasMoneyAccount = await MoneyAccount.findOne({ UserId })
    if(userHasMoneyAccount){
      throw new Error('Usuário já tem uma conta criada.');
    }

    const body = {
      type: 'user',
      UserId,
      balance: 0,
      createdBy
    }

    const moneyAccount = new MoneyAccount(body);
    await moneyAccount.save();
    return moneyAccount;
  }

  static async reactiveMoneyAccount(UserId, updatedBy){
    try {
      const moneyAccount = await MoneyAccount.findByIdAndUpdate(UserId, {$set: { active: true, updatedAt: new Date(), updatedBy }});
      return moneyAccount;
    } catch (err) {
      throw new Error(err)
    }
  }

  static async inativeMoneyAccount(UserId, updatedBy){
    try {
      await MoneyAccount.findByIdAndUpdate(UserId, {$set: { active: false, updatedAt: new Date(), updatedBy }});
      return { message: 'Usuário inativado.' }
    } catch (err) {
      throw new Error(err)
    }
  }
}