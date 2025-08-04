import PaymentReceiptService from "../service/paymentReceipt.service.js";

export default class PaymentReceiptController {
  static async getAll(req, res, next) {
    try {
      const paymentReceipts = await PaymentReceiptService.getAll();
      req.result = paymentReceipts;
      return next();
    } catch (err) {
      return next(err);
    }
  }
}
