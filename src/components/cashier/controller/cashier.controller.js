import ErrorBase from "../../../errors/base.error.js";
import NotFound from "../../../errors/notFound.error.js";
import OrderService from "../../order/order.service.js";
import Cashier from "../schemas/cashier.schema.js";
import fs from 'fs'
import CashierService from "../service/cashier.service.js";

export default class CashierController{
  static async getCashier(req, res, next) {
    try {
      const cashierFound = await Cashier.find();
      if(!cashierFound || cashierFound.length <= 0) return next(new NotFound('Nenhum caixa cadastrado.'))
      res.send(cashierFound)
    } catch (err) {
      return next(err)
    }
  }

  static async getMyCashier(req, res, next) {
    try {
      const cashierFound = await Cashier.findOne({ cashierUserLogin: req.userId, active: true });
      if(!cashierFound || cashierFound === null) {
        return next(new NotFound(`Caixa não encontrado pelo user`));
      }
      res.send(cashierFound);
    } catch (err) {
      return next(err)
    }
  }

  static async getCashierById(req, res, next) {
    const { id } = req.params;
    try {
      const cashierFound = await Cashier.findById(id);
      if(!cashierFound) return next(NotFound(`Caixa não encontrado pelo id ${id}`));
      res.send(cashierFound);
    } catch (err) {
      return next(err)
    }
  }
  
  static async exportPdf(req, res, next) {
    const { id } = req.params;
    try {
      const cashier = await Cashier.findById(id);
      if (!cashier) return next(new NotFound(`Caixa não encontrado pelo ID:${id}`));
      const filePath = await CashierService.exportCashierInPdf(cashier);
  
      res.download(filePath, `cashier_${cashier._id}_${Date.now()}.pdf`, (err) => {
        if (err) {
          console.error('Erro ao enviar o arquivo PDF:', err);
          return next(new ErrorBase('Erro ao enviar o arquivo PDF.', 400));
        }
  
        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.error('Erro ao processar o carrinho:', error);
      return next(new ErrorBase('Erro ao processar o pedido.', 500));
    }
  }
  
  static async openCashier(req, res, next) {
    const { cashInCashier } = req.body;
    try {
      const alreadyCashierOpened = await Cashier.findOne({ cashierUserLogin: req.userId, active: true });
      if(alreadyCashierOpened) return next(new ErrorBase('Caixa já está aberto!', 409));

      const cashier = {
        cashInCashier,
        cashierUserLogin: req.userId,
        createdBy: req.userId
      }

      const newCashier = new Cashier(cashier);
      await newCashier.save();
      res.send(newCashier);
    } catch (err) {
      return next(err)
    }
  }

  static async addCashAtCashierForced(req, res, next) {
    const { id } = req.params;
    const { cash } = req.body;
    try {
      const actualCash = await Cashier.findById(id);
      if(!actualCash) return next(new NotFound('Caixa não encontrado pelo id.'))
      const cashierUpdated = {
        $set: {
          cashInCashier: actualCash.cashInCashier + cash,
          updatedAt: new Date(),
          updatedBy: req.userId
        }
      }

      const newCashier = await Cashier.findByIdAndUpdate(id, cashierUpdated, {new : true});
      res.send(newCashier);
    } catch (err) {
      return next(err);
    }
  }

  static async closeCashier(req, res, next) {
    try {
      const alreadyCashierOpened = await Cashier.findOne({ cashierUserLogin: req.userId, active: true });
      if(!alreadyCashierOpened) return next(new ErrorBase('Nenhum caixa aberto!', 409));
      await Cashier.findByIdAndUpdate(alreadyCashierOpened._id, {$set: { active: false }});
      res.send({ message: 'Caixa fechado com sucesso!'})
    } catch (err) {
      return next(err)
    }
  }
}