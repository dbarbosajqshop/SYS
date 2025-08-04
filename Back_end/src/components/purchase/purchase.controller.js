import ErrorBase from "../../errors/base.error.js";
import NotFound from "../../errors/notFound.error.js";
import Item from "../item/schema/item.schema.js";
import Purchase from "./schema/purchase.schema.js";

export default class PurchaseController {
  static async getAll(req, res, next) {
    try {
      const purchases = await Purchase.find({ active: true })
        .populate({
          path: "Items.itemId",
          match: { active: true },
          select: "_id sku upc name nameImage dataImage contentType",
        })
        .sort({ purchaseDate: -1 });

      req.result = purchases;
      next();
    } catch (err) {
      return next(err.message);
    }
  }

  static async getBySkuOrCode(req, res, next) {
    const { id } = req.params;
    try {
      const { sku, upc, boxQuantity } = req.body;

      if (!boxQuantity) return next(new NotFound("boxQuantity não enviada"));

      const purchase = await Purchase.findOne({ _id: id, active: true }).populate({
        path: "Items.itemId",
        match: { active: true, ...(sku && { sku }), ...(upc && { upc }) },
        select: "_id sku upc name nameImage dataImage contentType",
      });

      if (!purchase || !purchase.Items.some((item) => item.itemId)) {
        return res.status(404).send({ error: "Item não encontrado nesta compra" });
      }

      const matchedItem = purchase.Items.find((item) => item.itemId);

      const itemQuantity = matchedItem.boxQuantity;

      let status;
      if (boxQuantity === itemQuantity) {
        status = "correto";
      } else if (boxQuantity < itemQuantity) {
        status = "parcial";
      } else {
        status = "incorreto";
      }

      const response = {
        item: { ...matchedItem.itemId.toObject() },
        quantityInPurchase: itemQuantity,
        requestedQuantity: boxQuantity,
        status,
      };

      res.send(response);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const purchases = await Purchase.findOne({ _id: id, active: true }).populate({
        path: "Items.itemId",
        match: { active: true },
        select: "_id sku upc name",
      });

      if (!purchases) return next(new NotFound("Compra não cadastrado."));

      return res.send(purchases);
    } catch (err) {
      return next(err.message);
    }
  }

  static async create(req, res, next) {
    const { Items, store, purchaseDate, state } = req.body;

    const isValidItem = async (item) => {
      const requiredProps = ["itemId", "boxQuantity", "boxValue"];
      const itemProps = Object.keys(item);

      if (
        requiredProps.every((prop) => itemProps.includes(prop)) &&
        itemProps.length === requiredProps.length
      ) {
        const itemExists = await Item.findOne({ _id: item.itemId, active: true });

        if (!itemExists) return { isValid: false, item };

        item.finalPrice = parseFloat(
          (item.boxQuantity * item.boxValue * itemExists.quantityBox).toFixed(2)
        );

        return { isValid: true, item };
      }

      return { isValid: false, item };
    };

    try {
      const validatedItems = await Promise.all(Items.map(isValidItem));

      const invalidItems = validatedItems.filter((result) => !result.isValid);
      if (invalidItems.length > 0) {
        return res
          .status(400)
          .send({ error: "Alguns itens são inválidos ou não encontrados", invalidItems });
      }

      const validItems = validatedItems.map((result) => result.item);

      const totalItems = validItems.reduce((sum, item) => sum + item.boxQuantity, 0);
      const totalValue = validItems.reduce((sum, item) => sum + item.finalPrice, 0);
      const purchaseReceived = {
        Items: validItems,
        totalItems,
        totalValue,
        store,
        purchaseDate: purchaseDate,
        state,
        createdBy: req.userId,
      };

      const newPurchase = new Purchase(purchaseReceived);
      await newPurchase.save();

      res.send(newPurchase);
    } catch (err) {
      return next(err);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const { Items, store, purchaseDate, state } = req.body;

    const isValidItem = async (item) => {
      const requiredProps = ["itemId", "boxQuantity", "boxValue"];
      const itemProps = Object.keys(item);

      if (
        requiredProps.every((prop) => itemProps.includes(prop)) &&
        itemProps.length === requiredProps.length
      ) {
        const itemExists = await Item.findOne({ _id: item.itemId, active: true });

        if (!itemExists) return { isValid: false, item };

        item.finalPrice = parseFloat(
          (item.boxQuantity * item.boxValue * itemExists.quantityBox).toFixed(2)
        );

        return { isValid: true, item };
      }

      return { isValid: false, item };
    };

    try {
      const validatedItems = await Promise.all(Items.map(isValidItem));

      const invalidItems = validatedItems.filter((result) => !result.isValid);
      if (invalidItems.length > 0)
        return res
          .status(400)
          .send({ error: "Alguns itens são inválidos ou não encontrados", invalidItems });

      const validItems = validatedItems.map((result) => result.item);

      const totalItems = validItems.reduce((sum, item) => sum + item.boxQuantity, 0);
      const totalValue = validItems.reduce((sum, item) => sum + item.finalPrice, 0);

      const purchaseReceived = {
        $set: {
          Items: validItems,
          totalItems,
          totalValue,
          store,
          purchaseDate,
          state,
          createdBy: req.userId,
        },
      };

      const purchaseUpdated = await Purchase.findByIdAndUpdate(id, purchaseReceived, {
        new: true,
      });
      if (!purchaseUpdated) return next(new NotFound("Compra não encontrada."));

      res.send(purchaseUpdated);
    } catch (err) {
      return next(err);
    }
  }

  static async reative(req, res, next) {
    const { id } = req.params;

    try {
      const isActivePurchase = await Purchase.findOne({ _id: id, active: true });

      if (isActivePurchase !== null)
        return next(new ErrorBase(`Compra já está ativo.`, 400));

      const purchaseInative = await Purchase.findByIdAndUpdate(id, {
        $set: { active: true, updatedAt: new Date(), updatedBy: req.userId },
      });
      await purchaseInative.save();

      return res.send({ message: `Compra ${purchaseInative.name} reativado.` });
    } catch (err) {
      return next(err);
    }
  }

  static async inative(req, res, next) {
    const { id } = req.params;

    try {
      const isActivePurchase = await Purchase.findOne({ _id: id, active: false });

      if (isActivePurchase === null)
        return next(new ErrorBase(`Compra já está inativado.`, 400));

      const purchaseInative = await Purchase.findByIdAndUpdate(id, {
        $set: { active: false, updatedAt: new Date(), updatedBy: req.userId },
      });
      await purchaseInative.save();

      return res.send({ message: `Compra ${purchaseInative.name} inativado.` });
    } catch (err) {
      return next(err);
    }
  }
}
