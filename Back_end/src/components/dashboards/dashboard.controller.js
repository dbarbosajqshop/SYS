import DashboardService from "./dashboard.service.js";

export default class DashboardController {
  static async getRegister(req, res, next) {
    try {
      const data = await DashboardService.getRegisterData();
      res.send(data);
    } catch (err) {
      next(err);
    }
  }

  static async getOrders(req, res, next) {
    try {
      const {
        SellerId,
        sellerName,
        ClientId,
        clientName,
        local,
        status,
        dateOfOrderStart,
        dateOfOrderEnd,
        payments
      } = req.query;

      const filters = {
        SellerId,
        sellerName, 
        ClientId,
        clientName,
        local,
        status,
        dateOfOrderStart,
        dateOfOrderEnd,
        payments: payments ? payments.split(',') : [],
      };

      const data = await DashboardService.getOrderFromUser(req.userId, filters);
      res.send(data);
    } catch (err) {
      console.error(err);
      next(err);
    }
  }

  static async getStocks(req, res, next) {
    try {
      const data = await DashboardService.getStockData();
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
  static async getPurchases(req, res, next) {
    try {
      const data = await DashboardService.getPurchaseData();
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
}
