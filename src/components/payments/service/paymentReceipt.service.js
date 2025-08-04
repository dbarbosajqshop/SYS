import NotFound from "../../../errors/notFound.error.js";
import CartService from "../../cart/cart.service.js";
import PaymentReceipt from "../schemas/paymentReceipt.schema.js";

export default class PaymentReceiptService{
  static async getAll(){
    try {
      const paymentsFound = await PaymentReceipt.find({ active: true });
      if(paymentsFound.length < 0){
        throw new NotFound('Nenhum pagamento encontrado.');
      }
      return paymentsFound;
    } catch (err) {
      throw new Error(err)
    }
  }

  static async create({type, amount, orderId, status, createdBy}) {
    try {
      const newReceipt = new PaymentReceipt({type, amount, orderId, status, createdBy});
      await newReceipt.save();
      return newReceipt;
    } catch (err) {
      throw new Error(err)
    }
  }

  static async validBalance({totalPrice, type, installment = 0, amount}){
    if (!totalPrice || !type || !amount) {
      throw new Error("Os campos totalPrice, type e amount são obrigatórios.");
    }

    let amountTaxed = 0;
    let balance = totalPrice - amount;

    if (type === "credito") {
      if (![1, 2, 3].includes(installment)) {
        throw new Error("O número de parcelas deve entre 1 à 3.");
      }

      const installmentRates = { 1: 0.05, 2: 0.07, 3: 0.08 };
      const taxRate = installmentRates[installment];

      amountTaxed = amount * taxRate;
    }

    return {
      amount,
      amountTaxed,
      balance: balance.toFixed(2), 
    };
  }
}