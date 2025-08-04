import User from "../auth/schema/user.schema.js";
import Build from "../build/schema/build.schema.js";
import Floor from "../floor/schema/floor.schema.js";
import Item from "../item/schema/item.schema.js";
import StockedItem from "../item/schema/stockedItem.schema.js";
import Order from "../order/schema/order.schema.js";
import Purchase from "../purchase/schema/purchase.schema.js";
import Street from "../street/schemas/street.schema.js";
import mongoose from "mongoose";

export default class DashboardService {
  static async getRegisterData() {
    const items = await Item.find({ active: true });
    const streets = await Street.find({ active: true });
    const builds = await Build.find({ active: true });
    const floors = await Floor.find({ active: true });

    return {
      countItem: items.length,
      countStreet: streets.length,
      countBuild: builds.length,
      countFloor: floors.length,
    };
  }

  static async getOrdersData(userId) {
    const agora = new Date();
    const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
    const fimMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 0);

    const vendasMes = await Order.find({
      active: true,
      createdAt: { $gte: inicioMes, $lte: fimMes },
    });

    const totalVendasMesCount = vendasMes.length;
    const totalVendasMesValue = vendasMes.reduce(
      (total, venda) => total + venda.totalPrice,
      0
    );

    const vendasVendedor = vendasMes.filter(
      (venda) => String(venda.SellerId) === String(userId)
    );

    const totalVendasVendedorCount = vendasVendedor.length;
    const totalVendasVendedorValue = vendasVendedor.reduce(
      (total, venda) => total + venda.totalPrice,
      0
    );

    return {
      totalVendasMesCount,
      totalVendasMesValue,
      totalVendasVendedorCount,
      totalVendasVendedorValue,
    };
  }

  static async getDeliveredOrders(UserId, startOfMonth, endOfMonth) {
    const deliveredOrders = await Order.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(UserId),
          status: "entregue",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: "$value" },
        },
      },
    ]);
    return deliveredOrders;
  }

  static async getPendingOrders(UserId, startOfMonth, endOfMonth) {
    const pendingOrders = await Order.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(UserId),
          status: "pendente",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalValue: { $sum: "$value" },
        },
      },
    ]);
    return pendingOrders;
  }

  static async getTop3Sellers(startOfMonth, endOfMonth) {
    const topSellers = await Order.aggregate([
      {
        $match: {
          status: "entregue",
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: "$userId",
          totalValue: { $sum: "$value" },
        },
      },
      {
        $sort: { totalValue: -1 },
      },
      {
        $limit: 3,
      },
    ]);
    return topSellers;
  }

  static async getOrderFromUser(UserId, filters = {}) {
    const {
      SellerId,
      sellerName, 
      ClientId,
      local,
      status,
      dateOfOrderStart,
      dateOfOrderEnd,
      payments
    } = filters;

    const user = await User.findById(UserId).populate({
      path: "Roles",
      match: { active: true },
      select: "name",
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }


    const startDate = dateOfOrderStart
      ? new Date(dateOfOrderStart)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const endDate = dateOfOrderEnd
      ? new Date(dateOfOrderEnd)
      : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

    const baseQuery = {
      active: true,
      createdAt: { $gte: startDate, $lte: endDate },
      ...(local && { local }),
      ...(status && { status }),
    };

    let sellerQuery = {};
    if (SellerId) {
      if (!mongoose.isValidObjectId(SellerId)) {
        throw new Error("SellerId inválido");
      }
      sellerQuery.SellerId = new mongoose.Types.ObjectId(SellerId);
    } else if (sellerName) {
      if (sellerName.length < 2) {
        throw new Error("Digite pelo menos 2 caracteres para buscar por nome");
      }

      const sellers = await User.find({
        name: { $regex: sellerName, $options: 'i' },
        active: true
      }).select('_id name');
      
      if (sellers.length > 0) {
        sellerQuery.SellerId = { $in: sellers.map(s => s._id) };
      } else {
        return {
          totalVendasMesCount: 0,
          totalVendasMesValue: 0,
          totalVendasVendedorCount: 0,
          totalVendasVendedorValue: 0,
          sellers: [] 
        };
      }
    }

    if (ClientId) {
      if (!mongoose.isValidObjectId(ClientId)) {
        throw new Error("ClientId inválido");
      }
      baseQuery.ClientId = new mongoose.Types.ObjectId(ClientId);
    }

    let paymentQuery = {};
    if (payments?.length) {
      paymentQuery = {
        'ReceiptPayments.typeOfPayment': { $in: payments }
      };
    }

    const finalQuery = { ...baseQuery, ...sellerQuery, ...paymentQuery };
    const isAdmin = user.Roles.some(role => role.name === "admin");
    const isSeller = user.Roles.some(role => role.name === "seller_online");

    if (isAdmin) {
      const vendasMes = await Order.find(finalQuery)
        .populate({
          path: "SellerId",
          select: "name"
        });

      const totalVendasMesCount = vendasMes.length;
      const totalVendasMesValue = vendasMes.reduce(
        (total, venda) => total + (venda.totalPrice || 0),
        0
      );

      let totalVendasVendedorCount = 0;
      let totalVendasVendedorValue = 0;

      if (sellerQuery.SellerId) {
        totalVendasVendedorCount = vendasMes.length;
        totalVendasVendedorValue = totalVendasMesValue;
      }

      const sellersFound = sellerName 
        ? await User.find({
            name: { $regex: sellerName, $options: 'i' },
            active: true
          }).select('name')
        : [];

      return {
        totalVendasMesCount,
        totalVendasMesValue,
        totalVendasVendedorCount,
        totalVendasVendedorValue,
        sellers: sellersFound
      };
    }

    if (isSeller) {
      const sellerQuery = {
        ...finalQuery,
        SellerId: new mongoose.Types.ObjectId(UserId)
      };

      const [deliveredOrders, pendingOrders] = await Promise.all([
        Order.aggregate([
          {
            $match: {
              ...sellerQuery,
              status: "entregue"
            }
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalValue: { $sum: "$totalPrice" }
            }
          }
        ]),
        Order.aggregate([
          {
            $match: {
              ...sellerQuery,
              status: "pendente"
            }
          },
          {
            $group: {
              _id: null,
              count: { $sum: 1 },
              totalValue: { $sum: "$totalPrice" }
            }
          }
        ])
      ]);

      return {
        deliveredOrders: deliveredOrders[0]?.totalValue || 0,
        deliveredCount: deliveredOrders[0]?.count || 0,
        pendingOrders: pendingOrders[0]?.totalValue || 0,
        pendingCount: pendingOrders[0]?.count || 0,
        topSellers: [] 
      };
    }

    throw new Error("Permissão insuficiente");
  }

  static async getStockData() {
    const orders = await Order.find({ active: true });
    const orderWaiting = orders.filter((order) => order.status === "pendente");
    const orderDeliveried = orders.filter(
      (order) => order.status === "entregue"
    );

    return {
      order: orders.length,
      orderWaiting: orderWaiting.length,
      orderDeliveried: orderDeliveried.length,
    };
  }

  static async getPurchaseData() {
    const purchases = await Purchase.find({ active: true });
    const pendingPurchases = purchases.filter(
      (purchase) => purchase.state === "pendente"
    );
    const deliveredPurchases = purchases.filter(
      (purchase) => purchase.state === "entregue"
    );

    const stockedItems = await StockedItem.find({ active: true }).populate(
      "quantity"
    );
    const stockedItemsWithQuantity = stockedItems?.filter(
      (stockedItem) => stockedItem?.quantity > 0
    );

    return {
      purchases: purchases.length,
      pendingPurchases: pendingPurchases.length,
      deliveredPurchases: deliveredPurchases.length,
      stockedItems: stockedItemsWithQuantity?.length,
    };
  }
}