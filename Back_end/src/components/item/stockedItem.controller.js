import NotFound from "../../errors/notFound.error.js";
import Floor from "../floor/schema/floor.schema.js";
import Item from "./schema/item.schema.js";
import Purchase from "../purchase/schema/purchase.schema.js";
import StockedItem from "./schema/stockedItem.schema.js";
import StockedItemService from "./stockedItem.service.js";
import ErrorBase from "../../errors/base.error.js";

export default class StockedItemController {
  static async seeAllItems(req, res, next) {
    const { local, name, sku, upc, type } = req.query;

    try {
      // Construir a consulta para os itens estocados
      let stockedItemsQuery = { active: true, quantity: { $gt: 0 } };
      if (local) stockedItemsQuery.local = new RegExp(local, "i");
      if (type) stockedItemsQuery.type = type;

      // Construir a consulta para os itens
      let itemsQuery = {};
      if (name) itemsQuery["itemDetails.name"] = new RegExp(name, "i");
      if (sku) itemsQuery["itemDetails.sku"] = new RegExp(sku, "i");
      if (upc) itemsQuery["itemDetails.upcList"] = upc;

      // Usar agregação para combinar os itens estocados com os detalhes dos itens
      const stockedItems = await StockedItem.aggregate([
        { $match: stockedItemsQuery }, // Filtrar os itens estocados
        {
          $lookup: {
            from: "items", // Nome da coleção de itens
            localField: "ItemId",
            foreignField: "_id",
            as: "itemDetails",
          },
        },
        { $unwind: "$itemDetails" }, // Desestruturar o array de detalhes do item
        { $match: itemsQuery }, // Filtrar os itens com base na consulta
        {
          $project: {
            _id: 1,
            name: "$itemDetails.name",
            sku: "$itemDetails.sku",
            upcList: "$itemDetails.upcList",
            // price: "$itemDetails.price",
            imageUrl: "$itemDetails.imageUrl",
            category: "$itemDetails.category",
            quantityBox: "$itemDetails.quantityBox",
            quantity: 1,
            local: 1,
            type: 1,
            costPrice: 1,
          },
        },
      ]).sort({ quantity: -1 }); // Ordenar os resultados por nome

      // Ordenar os resultados por 'name' de forma case-insensitive
      // stockedItems.sort((a, b) =>
      //   a.name.localeCompare(b.name, "pt", { sensitivity: "base" })
      // );

      req.result = stockedItems;
      next();
    } catch (err) {
      return next(err.message);
    }
  }

  static async stockNewPurchase(req, res, next) {
    const { purchaseId } = req.params;
    try {
      const purchase = await Purchase.findById(purchaseId);
      if (!purchase) return next(new NotFound("Compra não encontrada."));

      let savedItems = [];

      for (let item of purchase.Items) {
        const receivedStockedItem = {
          ItemId: item.itemId,
          quantity: item.boxQuantity,
          type: "box",
          costPrice: item.boxValue,
          createdBy: req.userId,
        };

        const savedStockedItem = new StockedItem(receivedStockedItem);
        await savedStockedItem.save();
        savedItems.push(savedStockedItem);
      }

      await Purchase.findByIdAndUpdate(purchase._id, {
        $set: {
          updatedAt: new Date(),
          updatedBy: req.userId,
          state: "entregue",
        },
      });
      return res.send(savedItems);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  static async stockAnItemInALocation(req, res, next) {
    const { id } = req.params;
    const { local } = req.body;

    try {
      const existedStockedItem = await StockedItem.findOne({
        _id: id,
        active: true,
      });
      if (!existedStockedItem) return next(new NotFound("Item não encontrado."));
      else if (existedStockedItem.local !== "Sem local")
        return next(new ErrorBase("Item já estocado", 409));

      const isFloorExisted = await Floor.findOne({ localCode: local });
      if (!isFloorExisted) return next(new NotFound("Local não encontrado."));

      const isItemAlreadyStocked =
        await StockedItemService.validExistsAnAlreadyStockedItem(
          existedStockedItem.ItemId,
          local,
          "box"
        );
      if (isItemAlreadyStocked !== null) {
        const incremented = await StockedItemService.incrementQuantityItem(
          isItemAlreadyStocked,
          existedStockedItem.quantity
        );
        await StockedItem.findByIdAndUpdate(id, { $set: { active: false } });
        return res.send(incremented);
      }
      const newStockedItem = {
        $set: {
          ItemId: existedStockedItem.ItemId,
          FloorId: isFloorExisted._id,
          local,
          costPrice: existedStockedItem.costPrice,
          quantity: existedStockedItem.quantity,
          type: "box",
          createdBy: req.userId,
        },
      };

      const stockedItem = await StockedItem.findByIdAndUpdate(id, newStockedItem);
      await stockedItem.save();
      await isFloorExisted.StockedItems.push(id);
      await isFloorExisted.save();

      const savedStockedItem = await StockedItem.findById(id);
      return res.send(savedStockedItem);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  static async updateQuantity(req, res, next) {
    const { id } = req.params;
    const { newQuantity } = req.body;
    try {
      if (!newQuantity) return next(new ErrorBase("Quantidade não enviada", 400));

      const stockedItemFound = await StockedItem.findById(id);
      stockedItemFound.quantity = newQuantity;
      await stockedItemFound.save();

      res.send(stockedItemFound);
    } catch (err) {
      return next(err);
    }
  }

  static async updateLocal(req, res, next) {
    const { id } = req.params;
    const { local, quantity, type } = req.body;

    try {
      if (quantity <= 0) return next(new ErrorBase("Quantidade inválida", 400));

      const updatedStockedItem = await StockedItemService.transferItemToNewLocation(
        id,
        local,
        type,
        quantity,
        req.userId
      );

      return res.send(updatedStockedItem);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
}
