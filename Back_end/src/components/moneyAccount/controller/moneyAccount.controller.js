import ErrorBase from "../../../errors/base.error.js";
import NotFound from "../../../errors/notFound.error.js";
import MoneyAccountService from "../services/moneyAccount.service.js";

export default class MoneyAccountController {
  static async getById(req, res, next) {
    try {
      const { UserId } = req.params;
      const moneyAccount = await MoneyAccountService.findByUser(UserId);
      return res.send(moneyAccount);
    } catch (err) {
      if(err){
        return next(new NotFound(err.message));
      }
      return next(err);
    }
  }

  static async create(req, res, next) {
    const { UserId } = req.params;
    try {
      if(!UserId) return next(new NotFound('Usuário não encontrado.'));

      const moneyAccount = await MoneyAccountService.createUserMoneyAccount(UserId, req.userId);

      return res.send(moneyAccount);
    } catch (err) {
      if(err) return next(new ErrorBase(err.message, 409));
      return next(err);
    }
  }
}