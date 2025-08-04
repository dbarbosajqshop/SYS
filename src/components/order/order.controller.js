import NotFound from "../../errors/notFound.error.js";
import OrderService from "./order.service.js";
import Order from "./schema/order.schema.js";
import Floor from "../floor/schema/floor.schema.js";
import ErrorBase from "../../errors/base.error.js";
import CartService from "../cart/cart.service.js";
import User from "../auth/schema/user.schema.js";
import MoneyAccount from "../moneyAccount/schemas/moneyAccount.schema.js";
import PaymentReceiptService from "../payments/service/paymentReceipt.service.js";
import mongoose from "mongoose";
import Dock from "../dock/schemas/dock.schema.js";
import PaymentReceipt from "../payments/schemas/paymentReceipt.schema.js";
import ReservedItemService from "../item/reservedItem.service.js";
import StockedItem from "../item/schema/stockedItem.schema.js";
import Client from "../client/schema/client.schema.js";

export default class OrderController {
  static async getAllOrders(req, _, next) {
    try {
      const {
        status,
        orderNumber,
        dateOfOrderStart,
        dateOfOrderEnd,
        local,
        SellerId,
        sellerName,
        ClientId,
        clientName,
        payments,
      } = req.query;
      const query = { active: true };

      if (dateOfOrderStart && isNaN(Date.parse(dateOfOrderStart)))
        return next(new ErrorBase("Data inicial inválida.", 400));

      if (dateOfOrderEnd && isNaN(Date.parse(dateOfOrderEnd)))
        return next(new ErrorBase("Data final inválida.", 400));

      if (
        status &&
        [
          "order",
          "pendente",
          "separacao",
          "conferencia",
          "docas",
          "transito",
          "entregue",
          "em pagamento",
        ].includes(status)
      )
        query.status = status;

      if (orderNumber) query.orderNumber = Number(orderNumber);

      if (dateOfOrderStart || dateOfOrderEnd) {
        const dateQuery = {};
        if (dateOfOrderStart) dateQuery.$gte = new Date(dateOfOrderStart);
        if (dateOfOrderEnd) dateQuery.$lte = new Date(dateOfOrderEnd);
        query.dateOfOrder = dateQuery;
      }

      if (local) {
        if (["online", "presencial"].includes(local)) {
          query.local = local;
        } else {
          query.local = { $regex: local, $options: "i" };
        }
      }

      if (SellerId) {
        if (!mongoose.isValidObjectId(SellerId))
          return next(new ErrorBase("SellerId inválido.", 400));
        query.SellerId = SellerId;
      } else if (sellerName) {
        const sellers = await User.find({
          name: { $regex: sellerName, $options: "i" },
          active: true,
        }).select("_id");

        if (sellers.length > 0) {
          query.SellerId = { $in: sellers.map((s) => s._id) };
        } else {
          req.result = [];
          return next();
        }
      }

      if (ClientId) {
        if (!mongoose.isValidObjectId(ClientId))
          return next(new ErrorBase("ClientId inválido.", 400));
        query.ClientId = ClientId;
      } else if (clientName) {
        if (clientName.length < 2) {
          return next(
            new ErrorBase("Digite pelo menos 2 caracteres para buscar por nome.", 400)
          );
        }
        const clients = await Client.find({
          name: { $regex: clientName, $options: 'i' },
          active: true
        }).select('_id name');

        if (clients.length > 0) {
          query.ClientId = { $in: clients.map((c) => c._id) };
          console.log(`Clientes encontrados: ${clients.map((c) => c.name).join(", ")}`);
        } else {
          return next(
            new NotFound(`Nenhum cliente encontrado com o nome: ${clientName}`)
          );
        }
      }

      const orders = await Order.find(query)
        .populate({
          path: "ClientId",
          select: "name",
          match: { active: true },
        })
        .populate({
          path: "SellerId",
          select: "name",
          match: { active: true },
        })
        .populate({
          path: "Items.ItemId",
          select: "_id sku upc name price",
        })
        .populate({
          path: "ReceiptPayments",
          select: "_id type amount installment",
        })
        .sort({ orderNumber: -1 });

      if (Array.isArray(payments) || payments?.length) {
        const filteredOrders = orders.filter((order) =>
          order.ReceiptPayments.some(
            (p) => p.type === payments || payments.includes(p.type)
          )
        );
        req.result = filteredOrders;
        return next();
      }

      req.result = orders;
      next();
    } catch (err) {
      return next(err);
    }
  }

  static async getBalance(req, res, next) {
    const { totalPrice, type, installment, amount } = req.body;
    try {
      const result = await PaymentReceiptService.validBalance({
        totalPrice,
        type,
        installment,
        amount,
      });
      res.send(result);
    } catch (err) {
      return next(err);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const order = await Order.findById(id)
        .populate({
          path: "ReceiptPayments",
          select: "_id type amount installment proofOfPaymentImageUrl",
        })
        .populate({
          path: "ClientId",
          select: "name _id cpf cnpj address email telephoneNumber", 
        })
        .populate({
          path: "SellerId",
          select: "name _id",
        })
        .populate({
          path: "Items.ItemId",
          select: "_id sku upc name price imageUrl quantityBox",
        });

      if (!order)
        return next(new NotFound(`Pedido de compra não encontrado pelo ID:${id}`));

      if (!order.active) return next(new NotFound("Pedido de compra inativo."));
      // Modificando a estrutura para incluir a imagem formatada
      const formattedOrder = {
        ...order.toObject(),
        dateOfOrder: order.dateOfOrder || order.createdAt,
        Items: order.Items.map((item) => ({
          ...item.toObject(),
          ItemId: {
            ...item.ItemId.toObject(),
            price:
              item.type === "box"
                ? item.ItemId.price * item.ItemId.quantityBox
                : item.ItemId.price,
          },
          imageUrl: item.ItemId.imageUrl || null,
        })),
      };

      res.send(formattedOrder);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  static async exportTaxCouponToPdf(req, res, next) {
    const { id } = req.params;
    try {
      const order = await Order.findById(id);
      if (!order)
        return next(new NotFound(`Ordem de compra não encontrada pelo ID:${id}`));

      const pdfBuffer = await OrderService.exportTaxCouponInPdf(order);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=tax_coupom_${order.orderNumber}_${Date.now()}.pdf`
      );
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Erro ao processar o carrinho:", error);
      next(new ErrorBase(error.message || "Erro ao processar o pedido.", 500));
    }
  }

  static async separateOrder(req, res, next) {
    const { id } = req.params;
    try {
      const { local, value, quantity, type } = req.body; // 'value' será usado para buscar no sku ou upc
      if (!local) return next(new ErrorBase("Local não enviado."));
      if (!quantity) return next(new NotFound("Quantidade não enviada."));

      // Verificar se o local existe
      const isLocalExists = await Floor.findOne({
        localCode: local,
        active: true,
      });
      if (!isLocalExists) return next(new NotFound("Local não existente."));

      // Buscar o pedido
      const order = await Order.findOne({
        _id: id,
        active: true,
        status: "separacao",
      }).populate({
        path: "Items.ItemId",
        match: {
          active: true,
          $or: [{ sku: value }, { upc: value }], // Busca pelo valor no sku ou upc
        },
        select: "_id sku upc name",
      });

      if (!order || !order.Items.some((item) => item.ItemId && item.type === type))
        return res.status(404).send({ error: "Item não encontrado nesta ordem." });

      const matchedItem = order.Items.find((item) => item.ItemId && item.type === type);

      // Verificar se o item existe no estoque
      const stockedItem = await StockedItem.findOne({
        ItemId: matchedItem.ItemId._id,
        local,
        type,
        active: true,
      });

      if (!stockedItem || stockedItem.quantity < quantity)
        return res.status(400).send({
          error: `Estoque insuficiente para o item ${matchedItem.ItemId.name} no local ${local}.`,
        });

      const itemQuantity = matchedItem.quantity;
      let status;

      if (quantity === itemQuantity) status = "correto";
      else if (quantity < itemQuantity) status = "parcial";
      else status = "incorreto";

      // Atualizar o status e o local do item no pedido
      await OrderService.updateOrderItemStatus(id, matchedItem.ItemId._id, status, type);
      await OrderService.updateOrderItemLocal(id, matchedItem.ItemId._id, local, type);

      const response = {
        item: { ...matchedItem.ItemId.toObject() },
        localToBeRemoved: local,
        quantityAtOrder: itemQuantity,
        requestedQuantity: quantity,
        status,
        type,
      };

      res.send(response);
    } catch (err) {
      if (err.message) return next(new ErrorBase(`${err.message}`, 400));

      next(err);
    }
  }

  static async saveSeparate(req, res, next) {
    const { id } = req.params;

    try {
      const order = await Order.findOne({ active: true, _id: id });
      if (!order) return res.status(404).send({ message: "Ordem não encontrada." });

      const items = order.Items || [];
      if (!Array.isArray(items))
        return res
          .status(400)
          .send({ message: "Itens da ordem estão em formato inválido." });

      const pendingItems = items.filter((item) => item.itemStatus !== "correto");
      const updatedBy = req.userId;

      if (pendingItems.length > 0) {
        await OrderService.updateOrderStatus(id, "pendente", updatedBy); // Atualizar status
        return res.status(200).send({
          message: "Ordem marcada como pendente devido a itens pendentes.",
        });
      }

      const separationResult = await OrderService.saveSeparation(id, items, updatedBy);
      res.status(200).send(separationResult);
    } catch (err) {
      console.error(err);
      if (err.message) return next(new ErrorBase(`${err.message}`, 400));

      return next(err);
    }
  }

  static async confirmPending(req, res, next) {
    const { id } = req.params;
    try {
      const order = await Order.findById({ _id: id, active: true });
      if (!order) return res.status(404).send({ message: "Ordem não encontrada." });

      await OrderService.updateOrderStatus(id, "separacao", req.userId);
      res.send({ message: "Pedido Confirmado com sucesso." });
    } catch (err) {
      return next(err);
    }
  }

  static async deliverOrder(req, res, next) {
    const { id } = req.params;
    try {
      const order = await Order.findById({ _id: id, active: true });
      if (!order) return res.status(404).send({ message: "Ordem não encontrada." });

      await OrderService.updateOrderStatus(id, "entregue", req.userId);
      res.send({ message: "Pedido Entregue com sucesso." });
    } catch (err) {
      return next(err);
    }
  }

  static async adjustPending(req, res, next) {
    const { id } = req.params;
    const { Items } = req.body;

    try {
      const order = await Order.findById({ _id: id, active: true });
      if (!order) return res.status(404).send({ message: "Ordem não encontrada." });
      const { discount, ReceiptPayments } = order;

      const toValidateItems = Items.map(({ ItemId, quantity, type }) => ({
        ItemId,
        quantity,
        type,
      }));
      await CartService.validItems(toValidateItems);

      const { calculatedSubtotal, calculatedTotalPrice } = await CartService.validValue(
        toValidateItems,
        discount,
        ReceiptPayments
      );

      const orderUpdated = await Order.findByIdAndUpdate(id, {
        $set: {
          Items,
          subtotalPrice: calculatedSubtotal,
          totalPrice: calculatedTotalPrice,
          itemsQuantity: Items.length,
          updatedBy: req.userId,
          updatedAt: new Date(),
        },
      });

      res.send(orderUpdated);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  static async saveCheck(req, res, next) {
    const { id } = req.params;
    const { Items } = req.body;

    try {
      const order = await Order.findOne({
        active: true,
        _id: id,
        status: "conferencia",
      });
      if (!order) return res.status(404).send({ message: "Ordem não encontrada." });

      if (!Items?.length)
        return res.status(400).send({ message: "Nenhum Item enviado." });

      const orderItems = order.Items || [];
      if (!Array.isArray(orderItems))
        return res
          .status(400)
          .send({ message: "Itens da ordem estão em formato inválido." });

      const invalidItems = Items.filter((item) => item && !item.completed);
      if (invalidItems.length > 0) {
        const orderUpdated = await Order.findByIdAndUpdate(
          id,
          {
            $set: {
              status: "pendente",
              updatedBy: req.userId,
              updatedAt: new Date(),
            },
          },
          { new: true }
        );

        return res.status(200).send({
          message: "Itens pendentes",
          invalidItems,
          orderUpdated,
        });
      }

      const mismatchedItems = Items.filter(
        (bodyItem) =>
          !orderItems.some(
            (orderItem) => String(orderItem.ItemId) === String(bodyItem.item._id)
          )
      );

      if (mismatchedItems.length > 0) {
        Order.findByIdAndUpdate(
          id,
          {
            $set: {
              status: "pendente",
              updatedBy: req.userId,
              updatedAt: new Date(),
            },
          },
          { new: true }
        );
        return res.status(400).send({
          message: "Os itens enviados não correspondem aos itens na ordem.",
          mismatchedItems,
        });
      }
      const orderUpdated = await Order.findByIdAndUpdate(
        id,
        {
          $set: {
            status: "docas",
            updatedBy: req.userId,
            updatedAt: new Date(),
          },
        },
        { new: true }
      );
      res.status(200).send(orderUpdated);
    } catch (err) {
      console.error(err);
      if (err.message) return next(new ErrorBase(`${err.message}`, 400));

      return next(err);
    }
  }

  static async saveProofOfPayment(req, res, next) {
    try {
      const user = await User.findById(req.userId).populate({
        path: "Roles",
        select: "name",
        match: { active: true },
      });

      if (!user) return next(new NotFound("Usuário não encontrado"));

      const { id } = req.params;
      const { ReceiptPayments } = req.body;

      const orderExisted = await Order.findOne({ _id: id, active: true });

      if (!ReceiptPayments || !ReceiptPayments.length)
        return next(new NotFound("Nenhum Pagamento recebido."));

      if (!orderExisted || orderExisted === undefined) {
        return next(new NotFound("Ordem não encontrada."));
      } else if (orderExisted.paymentStatus === "pago") {
        return next(new ErrorBase("Item já está pago e com comprovante.", 400));
      }
      // if (
      //   ReceiptPayments.some(
      //     (payment) =>
      //       payment.type === "keypix" && !payment?.proofOfPaymentImageUrl
      //   )
      //   return next(
      //     new ErrorBase(
      //       "Comprovante de pagamento obrigatório para keypix.",
      //       400
      //     )
      //   );
      orderExisted.totalPrice = Math.round(orderExisted.totalPrice * 100) / 100;
      let totalPaid = ReceiptPayments.reduce((acc, payment) => acc + payment.amount, 0);
      totalPaid = Math.round(totalPaid * 100) / 100;
      if (totalPaid !== orderExisted.totalPrice)
        return next(
          new ErrorBase(
            `Valor pago (${totalPaid}) não corresponde ao valor total da compra (${orderExisted.totalPrice}).`,
            400
          )
        );

      const sanatizedReceipts = ReceiptPayments.map((payment) => ({
        ...payment,
        status: "pago",
      }));

      const newReceipts = await Promise.all(
        sanatizedReceipts.map(async (payment) => {
          if (payment._id) {
            return await PaymentReceipt.findByIdAndUpdate(payment._id, {
              $set: { payment },
            });
          }
          const newReceipt = new PaymentReceipt({
            ...payment,
            createdBy: req.userId,
          });
          return await newReceipt.save();
        })
      );

      const updatedOrder = {
        ReceiptPayments: newReceipts.map((receipt) => receipt._id),
        paymentStatus: "pago",
        updatedAt: new Date(),
        updatedBy: req.userId,
      };

      const orderUpdated = await Order.findByIdAndUpdate(
        orderExisted._id,
        { $set: updatedOrder },
        { new: true }
      );

      return res.send(orderUpdated);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  static async checkPaymentOrder(req, res, next) {
    const { id } = req.params;

    const order = await Order.findById(id).populate({
      path: "ReceiptPayments",
      select: "type amount proofOfPaymentImageUrl",
    });
    if (!order || order === undefined) return next(new NotFound("Ordem não encontrada."));

    const { ReceiptPayments } = order;

    // if (
    //   ReceiptPayments.some(
    //     (payment) =>
    //       payment.type === "keypix" && !payment?.proofOfPaymentImageUrl
    //   )
    // )
    //   return next(
    //     new ErrorBase("Comprovante de pagamento obrigatório para keypix.", 400)
    //   );

    order.totalPrice = Math.round(order.totalPrice * 100) / 100;
    let totalPaid = ReceiptPayments.reduce((acc, payment) => acc + payment.amount, 0);
    totalPaid = Math.round(totalPaid * 100) / 100;
    if (totalPaid !== order.totalPrice)
      return next(
        new ErrorBase(
          `Valor pago (${totalPaid}) não corresponde ao valor total da compra (${order.totalPrice}).`,
          400
        )
      );

    const moneyAccount = await MoneyAccount.findOne({
      UserId: order.SellerId,
    });

    if (moneyAccount) {
      const balanceAdded = moneyAccount?.balance + order.totalPrice;
      await MoneyAccount.findByIdAndUpdate(moneyAccount._id, {
        $set: { balance: balanceAdded },
      });
    } else {
      const newMoneyAccount = new MoneyAccount({
        UserId: order.SellerId,
        balance: order.totalPrice,
      });
      await newMoneyAccount.save();
    }

    const orderUpdated = await Order.findByIdAndUpdate(order._id, {
      $set: { updatedAt: new Date(), status: "separacao" },
    });

    return res.send(orderUpdated);
  }

  static async updateOrder(req, res, next) {
    const { id } = req.params;
    const {
      Items,
      ClientId,
      SellerId,
      itemsQuantity,
      totalQuantity,
      totalPrice,
      subtotalPrice,
      discount,
      local,
      typeOfPayment,
      typeOfDelivery,
      status,
    } = req.body;

    const cartData = {
      $set: {
        Items,
        ClientId,
        SellerId,
        itemsQuantity,
        totalQuantity,
        totalPrice,
        subtotalPrice,
        discount,
        local,
        typeOfPayment,
        typeOfDelivery,
        status,
        updatedBy: req.userId,
        updatedAt: new Date(),
      },
    };

    try {
      const orderFounded = await Order.findOne({ _id: id, active: true });
      if (!orderFounded) return next(new NotFound("Compra não encontrada!"));

      await CartService.validItems(Items);
      await CartService.validClient(ClientId);
      await CartService.validSeller(SellerId);
      await CartService.validValue(Items, subtotalPrice, totalPrice, discount);

      await Order.findByIdAndUpdate(id, cartData);
      const orderUpdated = await Order.findById(id);

      return res.send(orderUpdated);
    } catch (err) {
      if (err.message) return next(new ErrorBase(`${err.message}`, 400));

      return next(err.message);
    }
  }

  static async checkOrder(req, res, next) {
    const { id } = req.params;
    try {
      const { value, quantity, checkedQuantity, type } = req.body;

      if (!type) return next(new NotFound("Tipo não enviado"));
      if (!quantity) return next(new NotFound("Quantidade não enviada"));
      if (!checkedQuantity && checkedQuantity !== 0)
        return next(new NotFound("Quantidade checada não enviada"));

      const order = await Order.findOne({
        _id: id,
        active: true,
        status: "conferencia",
      }).populate({
        path: "Items.ItemId",
        match: {
          active: true,
          $or: [{ sku: value }, { upc: value }], // Busca pelo valor no sku ou upc
        },
        select: "_id sku upc name",
      });

      if (!order || !order.Items.some((item) => item.ItemId && item.type === type))
        return res.status(404).send({ error: "Item não encontrado nesta ordem" });

      const matchedItem = order.Items.find((item) => item.ItemId && item.type === type);

      const itemQuantity = matchedItem.quantity;

      if (checkedQuantity + quantity > itemQuantity)
        return res.status(400).send({
          error: "Quantidade checada maior que a quantidade do pedido.",
        });

      const response = {
        item: { ...matchedItem.ItemId.toObject(), type: matchedItem.type },
        quantityAtOrder: itemQuantity,
      };

      res.send(response);
    } catch (err) {
      if (err.message) return next(new ErrorBase(`${err.message}`, 400));

      next(err);
    }
  }

  static async addDockToOrder(req, res, next) {
    const { id } = req.params;
    const { dock } = req.body;
    try {
      const order = await Order.findOne({ _id: id, active: true });
      if (!order) return next(new NotFound("Pedido não encontrado."));

      const validDock = await Dock.findOne({
        code: dock,
        active: true,
      });
      if (!validDock) return next(new NotFound("Doca não encontrada."));

      await Order.findByIdAndUpdate(id, {
        $set: { dock, updatedAt: new Date(), updatedBy: req.userId },
      });
      res.send({ message: "Doca adicionada com sucesso." });
    } catch (err) {
      return next(err);
    }
  }

  static async reativeOrder(req, res, next) {
    const { id } = req.params;
    try {
      const order = await Order.findById({ _id: id, active: false });
      if (!order)
        return next(
          new NotFound(`Pedido de compra não encontrado pelo ID:${id} ou já ativo`)
        );
      await Order.findByIdAndUpdate(id, {
        $set: { active: true, updatedAt: new Date(), updatedBy: req.userId },
      });
      const orderReative = await Order.findById({ _id: id, active: true });
      res.send({ message: "Pedido reativado com sucesso.", orderReative });
    } catch (err) {
      return next(err);
    }
  }

  static async deleteOrder(req, res, next) {
    const { id } = req.params;
    try {
      const order = await Order.findById({ _id: id, active: true });
      if (!order) {
        return next(new NotFound(`Pedido de compra não encontrado pelo ID:${id}`));
      }

      await ReservedItemService.removeReservedItem(id);

      await Order.findByIdAndUpdate(id, {
        $set: { active: false, updatedAt: new Date(), updatedBy: req.userId },
      });
      res.send("Pedido inativado com sucesso.");
    } catch (err) {
      return next(err);
    }
  }

  static async mostSoldItems(req, res) {
    try {
      const { limit = 10, page = 1, search, month } = req.query;

      const pageNumber = parseInt(page);
      const limitNumber = parseInt(limit);
      const skip = (pageNumber - 1) * limitNumber;

      let dateFilter = {};
      let itemSearchFilter = {};

      // Month filter (YYYY-MM format)
      if (month) {
        if (!/^\d{4}-\d{2}$/.test(month))
          return res.status(400).json({ message: "Invalid month format. Use YYYY-MM" });

        const [year, monthNum] = month.split("-").map(Number);
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 1);

        dateFilter = {
          dateOfOrder: {
            $gte: startDate,
            $lt: endDate,
          },
        };
      }
      // Time period filter

      // Search filter
      if (search) {
        const searchRegex = new RegExp(search, "i");
        itemSearchFilter = {
          $or: [
            { "itemDetails.sku": searchRegex },
            { "itemDetails.upc": searchRegex },
            { "itemDetails.name": searchRegex },
          ],
        };
      }

      // Base pipeline stages
      const basePipeline = [
        { $match: dateFilter },
        { $unwind: "$Items" },
        {
          $lookup: {
            from: "items",
            localField: "Items.ItemId",
            foreignField: "_id",
            as: "itemDetails",
          },
        },
        { $unwind: "$itemDetails" },
      ];

      // Add search filter if exists
      if (search) basePipeline.push({ $match: itemSearchFilter });

      // Pipeline for paginated results
      const paginatedPipeline = [
        ...basePipeline,
        {
          $group: {
            _id: "$Items.ItemId",
            totalQuantity: { $sum: "$Items.quantity" },
            timesOrdered: { $sum: 1 },
            totalSales: {
              $sum: {
                $multiply: ["$Items.quantity", "$itemDetails.price"],
              },
            },
            itemDetails: { $first: "$itemDetails" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $skip: skip },
        { $limit: limitNumber },
        {
          $project: {
            _id: 0,
            itemId: "$_id",
            itemImageUrl: "$itemDetails.imageUrl",
            itemName: "$itemDetails.name",
            itemSku: "$itemDetails.sku",
            itemUpc: "$itemDetails.upc",
            totalQuantitySold: "$totalQuantity",
            timesOrdered: "$timesOrdered",
            price: "$itemDetails.price",
            wholesalePrice: "$itemDetails.wholesalePrice",
            totalSales: 1,
            averagePrice: {
              $cond: [
                { $eq: ["$totalQuantity", 0] },
                0,
                { $divide: ["$totalSales", "$totalQuantity"] },
              ],
            },
          },
        },
      ];

      // Pipeline for top 10 items (without pagination or search)
      const top10Pipeline = [
        { $match: dateFilter },
        { $unwind: "$Items" },
        {
          $lookup: {
            from: "items",
            localField: "Items.ItemId",
            foreignField: "_id",
            as: "itemDetails",
          },
        },
        { $unwind: "$itemDetails" },
        {
          $group: {
            _id: "$Items.ItemId",
            totalQuantity: { $sum: "$Items.quantity" },
            timesOrdered: { $sum: 1 },
            totalSales: {
              $sum: {
                $multiply: ["$Items.quantity", "$itemDetails.price"],
              },
            },
            itemDetails: { $first: "$itemDetails" },
          },
        },
        { $sort: { totalQuantity: -1 } },
        { $limit: 10 },
        {
          $project: {
            _id: 0,
            itemId: "$_id",
            itemImageUrl: "$itemDetails.imageUrl",
            itemName: "$itemDetails.name",
            itemSku: "$itemDetails.sku",
            itemUpc: "$itemDetails.upc",
            totalQuantitySold: "$totalQuantity",
            timesOrdered: "$timesOrdered",
            price: "$itemDetails.price",
            wholesalePrice: "$itemDetails.wholesalePrice",
            totalSales: 1,
            averagePrice: {
              $cond: [
                { $eq: ["$totalQuantity", 0] },
                0,
                { $divide: ["$totalSales", "$totalQuantity"] },
              ],
            },
          },
        },
      ];

      // Execute both pipelines in parallel
      const [groupedItems, top10Items] = await Promise.all([
        Order.aggregate(paginatedPipeline),
        Order.aggregate(top10Pipeline),
      ]);

      // Count pipeline for pagination
      const countPipeline = [
        ...basePipeline,
        { $group: { _id: "$Items.ItemId" } },
        { $count: "totalItems" },
      ];

      const totalItemsResult = await Order.aggregate(countPipeline);
      const totalItems = totalItemsResult[0]?.totalItems || 0;
      const totalPages = Math.ceil(totalItems / limitNumber);

      // Totals pipeline for grand totals
      const totalsPipeline = [
        ...basePipeline,
        {
          $group: {
            _id: null,
            grandTotalSales: {
              $sum: { $multiply: ["$Items.quantity", "$itemDetails.price"] },
            },
            grandTotalQuantity: { $sum: "$Items.quantity" },
          },
        },
      ];

      const grandTotals = await Order.aggregate(totalsPipeline);

      res.json({
        data: groupedItems,
        top10Items, // Add top 10 items to response
        pagination: {
          totalItems,
          totalPages,
          currentPage: pageNumber,
          itemsPerPage: limitNumber,
          hasNextPage: pageNumber < totalPages,
          hasPreviousPage: pageNumber > 1,
        },
        totals: {
          grandTotalSales: grandTotals[0]?.grandTotalSales || 0,
          grandTotalQuantity: grandTotals[0]?.grandTotalQuantity || 0,
        },
      });
    } catch (error) {
      console.error("Error fetching most sold items:", error);
      res.status(500).json({
        message: "Server error while fetching most sold items",
        error: error.message,
      });
    }
  }
}
