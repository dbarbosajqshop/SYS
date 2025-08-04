import Cart from "./schema/cart.schema.js";
import Client from "../client/schema/client.schema.js";
import User from "../auth/schema/user.schema.js";
import StockedItem from "../item/schema/stockedItem.schema.js";
import Item from "../item/schema/item.schema.js";
import Order from "../order/schema/order.schema.js";
import CashierService from "../cashier/service/cashier.service.js";
import fs from "fs";
import ErrorBase from "../../errors/base.error.js";
import OrderService from "../order/order.service.js";
import PaymentReceiptService from "../payments/service/paymentReceipt.service.js";
import StockedItemService from "../item/stockedItem.service.js";
import Tax from "../tax/schema/tax.schema.js";
import ReservedItemService from "../item/reservedItem.service.js";
import ReservedItemController from "../item/reservedItem.controller.js";
import ReservedItem from "../item/schema/reservedItem.schema.js";
import mongoose from "mongoose";

export default class CartService {
  static async getCart(id) {
    const cart = await Cart.findOne({ createdBy: id, active: true });

    return cart;
  }

  static async createEmptyCart(cart) {
    const newCart = new Cart(cart);
    const savedCart = await newCart.save();

    return savedCart;
  }

  static async validPropsItems(items) {
    if (!Array.isArray(items)) throw new Error("Items precisa ser um array");

    const requiredProperties = ["ItemId", "quantity"];

    for (const item of items) {
      if (typeof item !== "object" || item === null)
        throw new Error("Cada item precisa ser um objeto");

      const hasRequiredProperties = requiredProperties.every((prop) => prop in item);
      if (!hasRequiredProperties)
        throw new Error("Cada item precisa conter as propriedades obrigatórias");
    }

    return true;
  }

  static async taxItems(Items) {
    let totalTax = 0;
    let calculatedSubtotal = 0;

    const retailWholesaleTax = await Tax.findOne({ selected: true });

    for (let item of Items) {
      const { ItemId, quantity, type } = item;

      const itemData = await Item.findById(ItemId);
      if (!itemData) throw new Error(`Item com ID ${ItemId} não encontrado.`);

      const basePrice = itemData.isPromotion ? itemData.promotionPrice : itemData.price;

      let itemSubtotal =
        item.type === "unit"
          ? basePrice * quantity
          : basePrice * itemData.quantityBox * quantity;

      const isBoxQuantity = quantity >= itemData.quantityBox || type === "box";

      if (itemData.taxPrices && !isBoxQuantity) {
        if (retailWholesaleTax)
          itemSubtotal =
            quantity >= retailWholesaleTax.minWholesaleQuantity
              ? itemData.wholesalePrice * quantity
              : itemData.retailPrice * quantity;
        else
          itemSubtotal =
            quantity >= 2 ? itemData.wholesalePrice * quantity : basePrice * quantity;
      }

      calculatedSubtotal += itemSubtotal;

      let taxRate = 0;
      if (!isBoxQuantity) {
        if (itemData.isPromotion) taxRate = 0;
        else if (itemData.taxPrices) taxRate = 0;
        else if (retailWholesaleTax) {
          const isWholesale = quantity >= retailWholesaleTax.minWholesaleQuantity;
          taxRate = isWholesale
            ? retailWholesaleTax.wholesaleTaxPercentage / 100
            : retailWholesaleTax.retailTaxPercentage / 100;
        } else taxRate = quantity === 1 ? 0.35 : 0.15;
      }

      const itemTax = itemSubtotal * taxRate;
      totalTax += itemTax;

      item.itemTotalPrice = itemSubtotal + itemTax;
      item.itemUnitPrice = (itemSubtotal + itemTax) / quantity;
    }

    Items.totalTax = totalTax;
    Items.calculatedSubtotal = calculatedSubtotal + totalTax;

    return Items;
  }

  static async validValue(Items, discount, ReceiptPayments) {
    try {
      const itemsTaxed = await this.taxItems(Items);
      let calculatedSubtotal = itemsTaxed.calculatedSubtotal;
      let calculatedTotalPrice = calculatedSubtotal - discount;

      if (ReceiptPayments?.length)
        for (const payment of ReceiptPayments) {
          if (payment.type === "credito") {
            const creditTaxRate =
              payment.installments === 1
                ? 0.05
                : payment.installments === 2
                ? 0.07
                : payment.installments === 3
                ? 0.08
                : 0;
            calculatedTotalPrice += payment.amount * creditTaxRate;
          }
        }

      return {
        calculatedSubtotal,
        calculatedTotalPrice,
      };
    } catch (error) {
      throw new Error(`Erro ao validar os valores do carrinho: ${error.message}`);
    }
  }

  static async validQuantity(item, stockedItems) {
    const stockedItemsQuantity = stockedItems.filter(
      (stockedItem) => stockedItem.type === item.type
    );
    const reservedItems = await ReservedItem.find({ ItemId: item.ItemId, active: true });

    let totalUnitsAvailable = stockedItemsQuantity.reduce(
      (total, stockedItem) => (total += stockedItem.quantity),
      0
    );

    const totalBoxesReserved = reservedItems.reduce(
      (total, reservedItem) => (total += reservedItem.quantityBox || 0),
      0
    );

    const totalUnitsReserved = reservedItems.reduce(
      (total, reservedItem) => (total += reservedItem.quantityUnit || 0),
      0
    );

    if (item.type === "unit") totalUnitsAvailable -= totalUnitsReserved || 0;

    if (item.type === "box") totalUnitsAvailable -= totalBoxesReserved || 0;

    if (totalUnitsAvailable < item.quantity)
      throw new Error(
        `Quantidade de itens estocados menor que a solicitada. ` +
          `Item: ${item.ItemId}, Solicitado: ${item.quantity}, ` +
          `Disponível em estoque: ${totalUnitsAvailable}.`
      );

    return true;
  }

  static async validItems(items) {
    const isPropsValid = await this.validPropsItems(items);
    if (!isPropsValid) throw new Error("Propriedades incorretas nos itens fornecidos.");

    for (let item of items) {
      const itemData = await Item.findById(item.ItemId);
      if (!itemData)
        throw new Error(`Item não encontrado ou não estocado. ID: ${item.ItemId}`);

      const stockedItems = await StockedItem.find({
        ItemId: item.ItemId,
        active: true,
      });
      if (stockedItems.length === 0) {
        throw new Error(`Nenhum estoque encontrado para o item. ID: ${item.ItemId}`);
      }
      await this.validQuantity(item, stockedItems);
    }

    return true;
  }

  static async validClient(id) {
    const client = await Client.findById(id);
    if (!client) throw new Error("Cliente não encontrado pelo id.");
    return client;
  }

  static async validSeller(id) {
    const seller = await User.findById(id);
    if (!seller) throw new Error("Vendedor não encontrado.");
    return true;
  }

  static async validPayments(payments, totalPrice) {
    totalPrice = Math.round(totalPrice * 100) / 100;
    if (!payments || !payments.length || payments.length > 3)
      throw new Error("O carrinho deve ter entre 1 a 3 pagamentos.");

    let totalPaid = 0;
    let totalTax = 0;
    let change = 0;
    for (const payment of payments) {
      const { type, amount, installment } = payment;

      const { amountTaxed } = await PaymentReceiptService.validBalance({
        totalPrice,
        type,
        installment: installment || 0,
        amount,
      });

      totalPaid += amount;
      totalTax += amountTaxed;

      if (type === "dinheiro") {
        const excess = totalPaid + totalTax - totalPrice;
        if (excess > 0) {
          change = excess;
          totalPaid -= change;
        }
      }
    }

    const totalCalculatedPrice = totalPaid + totalTax;

    if (payments.length && totalCalculatedPrice < totalPrice) {
      throw new Error(
        `O valor total dos pagamentos (${totalCalculatedPrice.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}) não cobre o valor total da compra (${totalPrice.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}).`
      );
    }

    return { totalPaid: totalCalculatedPrice, change };
  }

  static async sellOrder(cartData, paymentReceipts) {
    cartData.status = "em pagamento";
    cartData.local = "online";
    cartData.ReceiptPayments = [];

    const orderNumber = await Order.generateOrderNumber();

    for (const payment of paymentReceipts) {
      if (payment.type === "dinheiro") {
        payment.status = "pago";
        cartData.status = "separacao";
      }
      const newPaymentReceipt = await PaymentReceiptService.create({
        ...payment,
        createdBy: cartData.createdBy,
      });
      cartData.ReceiptPayments.push(newPaymentReceipt._id);
    }
    const newOrder = new Order({
      ...cartData,
      dateOfOrder: new Date(),
      orderNumber,
    });
    const saveOrder = await newOrder.save();

    for (const item of cartData.Items) {
      const { ItemId, quantity, type } = item;
      try {
        await ReservedItemService.reserveItem(
          ItemId,
          quantity,
          type,
          cartData.createdBy,
          newOrder._id
        );
      } catch (err) {
        throw new Error(`Erro ao reservar o item ${item.name}: ${err.message}`);
      }
    }

    const order = await Order.findById(saveOrder._id).populate(
      "ReceiptPayments",
      "type amount status date"
    );
    return order;
  }

  static async sellOrderLocal(cartData, userId, paymentReceipts) {
    cartData.status = "entregue";
    cartData.local = "presencial";
    cartData.ReceiptPayments = [];
    const orderNumber = await Order.generateOrderNumber();

    for (const payment of paymentReceipts) {
      const newPaymentReceipt = await PaymentReceiptService.create({
        ...payment,
        status: "pago",
        createdBy: cartData.createdBy,
      });
      cartData.ReceiptPayments.push(newPaymentReceipt._id);
      await this.saveCashier(payment.type, userId, cartData.totalPrice, payment.amount);
    }

    for (const cartItem of cartData.Items) {
      const { ItemId, quantity } = cartItem;
      try {
        await StockedItemService.removeItem(ItemId, quantity);
      } catch (err) {
        throw new Error(
          `Erro ao remover o item ${cartItem.name || ItemId}: ${err.message}`
        );
      }
    }

    const newOrder = new Order({
      ...cartData,
      dateOfOrder: new Date(),
      orderNumber,
    });
    const saveOrder = await newOrder.save();

    cartData.orderNumber = orderNumber;
    cartData.dateOfOrder = new Date();
    const order = await Order.findById(saveOrder._id).populate(
      "ReceiptPayments",
      "type amount status date"
    );
    return order;
  }

  static async processLocalCart(cartData, res, next, orderNumber) {
    try {
      cartData.orderNumber = orderNumber;

      const filePath = await OrderService.exportTaxCouponInPdf(cartData);

      res.download(filePath, `tax_coupom_${orderNumber}_${Date.now()}.pdf`, (err) => {
        if (err) {
          console.error("Erro ao enviar o arquivo PDF:", err);
          return next(new ErrorBase("Erro ao enviar o arquivo PDF.", 400));
        }

        fs.unlinkSync(filePath);
      });
    } catch (error) {
      console.error("Erro ao processar o carrinho:", error);
      next(new ErrorBase("Erro ao processar o pedido.", 500));
    }
  }

  static async saveCashier(typeOfPayment, userId, value, paidAmount) {
    const actions = {
      credito: async () => await CashierService.addCreditCartAtCashier(userId, value),
      debito: async () => await CashierService.addDebitCartAtCashier(userId, value),
      pix: async () => await CashierService.addPixAtCashier(userId, value),
      dinheiro: async () => await this.addCashWithChange(userId, value, paidAmount),
      voucher: async () => await CashierService.addVoucherPaymentAtCashier(userId, value),
    };

    const action = actions[typeOfPayment];

    if (!action) throw new Error("Tipo de pagamento inválido!");

    await action();
    return;
  }

  static async addCashWithChange(userId, value, paidAmount) {
    if (isNaN(value) || isNaN(paidAmount)) {
      throw new Error("O valor ou o valor pago não são números válidos!");
    }

    let change = paidAmount - value;
    if (change < 0) throw new Error("O valor pago é inferior ao valor da compra!");

    if (isNaN(change)) throw new Error("O valor do troco é inválido!");

    console.log(`Troco a ser devolvido: R$ ${change.toFixed(2)}`);

    const cashier = await CashierService.getCashier(userId);
    if (isNaN(cashier.cashInCashier)) throw new Error("O valor do caixa é inválido!");

    const newCashInCashier = cashier.cashInCashier + paidAmount - change;

    console.log("paidamount:");
    console.log(paidAmount);
    console.log("change:");
    console.log(change);
    console.log("cash in cashier:");
    console.log(cashier.cashInCashier);
    console.log("cash:");
    console.log(newCashInCashier.toFixed(2));

    if (isNaN(newCashInCashier)) {
      throw new Error("O valor atualizado do caixa é inválido!");
    }

    await CashierService.updateCashierAmount(userId, newCashInCashier);
  }

  static async aggregateItems(query) {
    const matchStage = { active: true };

    if (query.item) {
      const itemSearch = query.item;

      try {
        const itemMatches = await Item.find({
          $or: [
            { sku: itemSearch },
            { upc: itemSearch },
            { name: { $regex: itemSearch, $options: "i" } },
          ],
        }).select("_id");

        if (itemMatches.length > 0)
          matchStage.ItemId = { $in: itemMatches.map((item) => item._id) };
        else throw new Error("Nenhum item encontrado com o valor fornecido.");
      } catch (error) {
        console.error("Erro na busca de item:", error);
        throw {
          message: "Um ou mais dados fornecidos estão incorretos",
          status: 400,
        };
      }
    }

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "items",
          localField: "ItemId",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      { $unwind: "$itemDetails" },
      // Consulta aos itens reservados - ajustada para nova estrutura
      {
        $lookup: {
          from: "reserveditems",
          localField: "ItemId",
          foreignField: "ItemId",
          as: "reservedItems",
          pipeline: [
            { $match: { active: true } },
            {
              $group: {
                _id: "$ItemId",
                totalReservedUnits: { $sum: "$quantityUnit" },
                totalReservedBoxes: { $sum: "$quantityBox" },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          reservedUnits: {
            $ifNull: [{ $arrayElemAt: ["$reservedItems.totalReservedUnits", 0] }, 0],
          },
          reservedBoxes: {
            $ifNull: [{ $arrayElemAt: ["$reservedItems.totalReservedBoxes", 0] }, 0],
          },
        },
      },
      {
        $group: {
          _id: "$ItemId",
          totalUnits: {
            $sum: {
              $cond: [{ $eq: ["$type", "unit"] }, "$quantity", 0],
            },
          },
          totalBoxes: {
            $sum: {
              $cond: [{ $eq: ["$type", "box"] }, "$quantity", 0],
            },
          },
          reservedUnits: { $first: "$reservedUnits" },
          reservedBoxes: { $first: "$reservedBoxes" },
          details: { $first: "$itemDetails" },
        },
      },
      {
        $project: {
          ItemId: "$_id",
          _id: 0,
          sku: "$details.sku",
          name: "$details.name",
          upcList: "$details.upcList",
          price: "$details.price",
          promotionPrice: "$details.promotionPrice",
          isPromotion: "$details.isPromotion",
          taxPrices: "$details.taxPrices",
          wholesalePrice: "$details.wholesalePrice",
          retailPrice: "$details.retailPrice",
          totalUnits: {
            $max: [{ $subtract: ["$totalUnits", "$reservedUnits"] }, 0],
          },
          totalBoxes: {
            $max: [{ $subtract: ["$totalBoxes", "$reservedBoxes"] }, 0],
          },
          quantityOfBox: "$details.quantityBox",
          imageUrl: "$details.imageUrl",
        },
      },
      {
        $sort: { name: 1 },
      },
    ];

    return await StockedItem.aggregate(pipeline);
  }

  static async aggregateItemById(itemId) {
    const matchStage = { active: true, ItemId: new mongoose.Types.ObjectId(itemId) };

    const pipeline = [
      { $match: matchStage },
      {
        $lookup: {
          from: "items",
          localField: "ItemId",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      { $unwind: "$itemDetails" },
      {
        $lookup: {
          from: "reserveditems",
          localField: "ItemId",
          foreignField: "ItemId",
          as: "reservedItems",
          pipeline: [
            { $match: { active: true } },
            {
              $group: {
                _id: "$ItemId",
                totalReservedUnits: { $sum: "$quantityUnit" },
                totalReservedBoxes: { $sum: "$quantityBox" },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          reservedUnits: {
            $ifNull: [{ $arrayElemAt: ["$reservedItems.totalReservedUnits", 0] }, 0],
          },
          reservedBoxes: {
            $ifNull: [{ $arrayElemAt: ["$reservedItems.totalReservedBoxes", 0] }, 0],
          },
        },
      },
      {
        $group: {
          _id: "$ItemId",
          totalUnits: {
            $sum: {
              $cond: [{ $eq: ["$type", "unit"] }, "$quantity", 0],
            },
          },
          totalBoxes: {
            $sum: {
              $cond: [{ $eq: ["$type", "box"] }, "$quantity", 0],
            },
          },
          reservedUnits: { $first: "$reservedUnits" },
          reservedBoxes: { $first: "$reservedBoxes" },
          details: { $first: "$itemDetails" },
        },
      },
      {
        $project: {
          ItemId: "$_id",
          _id: 0,
          sku: "$details.sku",
          name: "$details.name",
          upcList: "$details.upcList",
          price: "$details.price",
          promotionPrice: "$details.promotionPrice",
          isPromotion: "$details.isPromotion",
          taxPrices: "$details.taxPrices",
          wholesalePrice: "$details.wholesalePrice",
          retailPrice: "$details.retailPrice",
          totalUnits: {
            $max: [{ $subtract: ["$totalUnits", "$reservedUnits"] }, 0],
          },
          totalBoxes: {
            $max: [{ $subtract: ["$totalBoxes", "$reservedBoxes"] }, 0],
          },
          quantityOfBox: "$details.quantityBox",
          imageUrl: "$details.imageUrl",
        },
      },
    ];

    const result = await StockedItem.aggregate(pipeline);
    return result[0] || null;
  }
}
