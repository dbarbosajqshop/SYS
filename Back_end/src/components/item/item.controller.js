import ErrorBase from "../../errors/base.error.js";
import IncorretRequest from "../../errors/incorretRequest.error.js";
import NotFound from "../../errors/notFound.error.js";
import Item from "./schema/item.schema.js";
import AuditLogItemService from "../item/log/service/auditLogItem.service.js";
import StockedItem from "../item/schema/stockedItem.schema.js";

export default class ItemController {
  static async getAll(req, res, next) {
    try {
      const items = await Item.find({ active: true }).sort({ name: 1 });

      const itemsWithImages = items.map((item) => {
        const { dataImage, ...itemObj } = item.toObject();
        return {
          ...itemObj,
          imageUrl: itemObj?.imageUrl || null,
        };
      });

      req.result = itemsWithImages;
      next();
    } catch (err) {
      return next(err.message);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const items = await Item.findOne({ _id: id, active: true });

      if (!items) return next(new NotFound("Item não cadastrado."));

      return res.send(items);
    } catch (err) {
      return next(err.message);
    }
  }

  static async getItem(req, res, next) {
    const { sku, upc, name } = req.query;

    try {
      const query = { active: true };
      const conditions = [];

      if (name) conditions.push({ name: new RegExp(name, "i") });

      if (sku) conditions.push({ sku });

      if (upc) conditions.push({ upcList: upc });

      if (conditions.length > 0) query.$or = conditions;

      const items = await Item.find(query).sort({ name: 1 });

      if (items.length === 0)
        return res.status(404).send({ message: "Nenhum item encontrado" });

      req.result = items;
      next();
    } catch (err) {
      console.error(err);
      return next(err.message);
    }
  }

  static async getItemNcm(req, res, next) {
    const { sku, upc, name } = req.query;

    try {
      // Monta o filtro dos itens
      const itemQuery = { active: true };
      const conditions = [];

      if (name) conditions.push({ name: new RegExp(name, "i") });
      if (sku) conditions.push({ sku });
      if (upc) conditions.push({ upcList: upc });
      if (conditions.length > 0) itemQuery.$or = conditions;

      // Busca os itens que batem com o filtro
      const items = await Item.find(itemQuery);

      items.sort((a, b) => {
        if (a.ncm && !b.ncm) return -1;
        if (!a.ncm && b.ncm) return 1;
        if (!a.ncm && !b.ncm) return 0;
        // Ambos têm ncm, ordena pelo valor
        if (a.ncm < b.ncm) return -1;
        if (a.ncm > b.ncm) return 1;
        return 0;
      });

      if (!items.length) {
        req.result = [];
        return next();
      }

      // Pega os IDs dos itens encontrados
      const itemIds = items.map((item) => item._id);

      // Agrega os dados de estoque por ItemId (não filtra por quantity > 0)
      const stockedData = await StockedItem.aggregate([
        {
          $match: {
            ItemId: { $in: itemIds },
            active: true,
          },
        },
        {
          $group: {
            _id: "$ItemId",
            totalBox: {
              $sum: { $cond: [{ $eq: ["$type", "box"] }, "$quantity", 0] },
            },
            totalUnit: {
              $sum: { $cond: [{ $eq: ["$type", "unit"] }, "$quantity", 0] },
            },
            avgCostPrice: {
              $avg: {
                $cond: [
                  { $and: [{ $gt: ["$costPrice", 0] }, { $ne: ["$costPrice", null] }] },
                  "$costPrice",
                  null,
                ],
              },
            },
          },
        },
      ]);

      // Cria um mapa para acesso rápido
      const stockMap = {};
      for (const s of stockedData) {
        stockMap[s._id.toString()] = s;
      }

      // Monta o resultado final, sempre retornando o item, mesmo sem estoque
      const result = items.map((item) => {
        const stock = stockMap[item._id.toString()] || {};
        return {
          ...item.toObject(),
          totalBox: stock.totalBox || 0,
          totalUnit: stock.totalUnit || 0,
          avgCostPrice: stock.avgCostPrice || 0,
        };
      });

      req.result = result;
      next();
    } catch (err) {
      console.error(err);
      return next(err.message);
    }
  }

  static async findPhotoById(req, res, next) {
    const { id } = req.params;

    try {
      const itemExisted = await Item.findById(id);

      if (!itemExisted.nameImage) return next(new NotFound("Image not found"));

      res.set("Content-Type", itemExisted.contentType);
      res.send(itemExisted.dataImage);
    } catch (err) {
      return next(err);
    }
  }

  static async create(req, res, next) {
    const { sku, upcList } = req.body;

    const itemReceived = {
      ...req.body,
      createdBy: req.userId,
    };

    try {
      if (Array.isArray(upcList)) {
        const existingItem = await Item.findOne({ upcList: { $in: upcList } });

        if (existingItem)
          return next(
            new ErrorBase(
              `Código de barras já utilizado no ítem: ${existingItem.name}`,
              409
            )
          );
      }

      const isItemExisted = await Item.find({ sku });
      if (isItemExisted.length > 0)
        return next(new ErrorBase("Conflito em item já existente", 409));

      const item = new Item(itemReceived);
      const savedItem = await item.save();

      await AuditLogItemService.logItemAction({
        itemId: savedItem._id,
        action: "CREATE",
        newData: savedItem.toObject(),
        changedBy: req.userId,
        req,
      });

      res.send(savedItem);
    } catch (err) {
      return next(err);
    }
  }

  static async savePhoto(req, res, next) {
    const { id } = req.params;
    const { url } = req.body;

    if (!url) return new IncorretRequest("a URL é obrigatória");
    try {
      const oldItem = await Item.findById(id);
      if (!oldItem) return next(new NotFound("Item não encontrado."));

      const updatedItem = await Item.findByIdAndUpdate(
        id,
        {
          $set: {
            imageUrl: url,
            updatedAt: new Date(),
            updatedBy: req.userId,
          },
        },
        { new: true }
      );

      await AuditLogItemService.logItemAction({
        itemId: id,
        action: "UPDATE_PHOTO",
        previousData: { imageUrl: oldItem.imageUrl },
        newData: { imageUrl: url },
        changedBy: req.userId,
        req,
      });

      res.send(updatedItem.imageUrl);
    } catch (e) {
      return next(e);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const { sku, upcList } = req.body;

    const itemReceived = {
      ...req.body,
      updatedAt: new Date(),
      updatedBy: req.userId,
    };

    try {
      const oldItem = await Item.findById(id);
      if (!oldItem) return next(new NotFound("Item não encontrado."));

      if (Array.isArray(upcList)) {
        const existingItem = await Item.findOne({
          _id: { $ne: id }, // exclui o item atual
          upcList: { $in: upcList },
        });

        if (existingItem)
          return next(
            new ErrorBase(
              `Código de barras já utilizado no ítem: ${existingItem.name}`,
              409
            )
          );
      }

      const existingSkuItem = await Item.findOne({ _id: { $ne: id }, sku });
      if (existingSkuItem)
        return next(new ErrorBase("Já existe um item com esse SKU", 409));

      const updatedItem = await Item.findByIdAndUpdate(id, itemReceived, {
        new: true,
      });

      await AuditLogItemService.logItemAction({
        itemId: id,
        action: "UPDATE",
        previousData: oldItem.toObject(),
        newData: updatedItem.toObject(),
        changedBy: req.userId,
        req,
      });

      res.send(updatedItem);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  static async updateNcm(req, res, next) {
    const { id } = req.params;
    const { ncm } = req.body;
    const itemReceived = {
      ncm,
      updatedAt: new Date(),
      updatedBy: req.userId,
    };
    try {
      const oldItem = await Item.findById(id);
      if (!oldItem) return next(new NotFound("Item não encontrado."));
      if (!ncm) return next(new IncorretRequest("NCM é obrigatório."));
      if (oldItem.ncm === ncm) return next(new ErrorBase("NCM já está cadastrado.", 400));

      const existingNcmItem = await Item.findOne({
        _id: { $ne: id },
        ncm,
      });
      if (existingNcmItem)
        return next(new ErrorBase("Já existe um item com esse NCM: " + existingNcmItem.name, 409));

      const updatedItem = await Item.findByIdAndUpdate(id, itemReceived, { new: true });
      await AuditLogItemService.logItemAction({
        itemId: id,
        action: "UPDATE",
        previousData: oldItem.toObject(),
        newData: updatedItem.toObject(),
        changedBy: req.userId,
        req,
      });
      return res.send(updatedItem);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }

  static async reative(req, res, next) {
    const { id } = req.params;
    try {
      const oldItem = await Item.findById(id);
      if (!oldItem) return next(new NotFound("Item não encontrado."));
      if (oldItem.active) return next(new ErrorBase("Item já está ativo.", 400));

      const updatedItem = await Item.findByIdAndUpdate(
        id,
        {
          $set: {
            active: true,
            updatedAt: new Date(),
            updatedBy: req.userId,
          },
        },
        { new: true }
      );

      await AuditLogItemService.logItemAction({
        itemId: id,
        action: "REACTIVATE",
        previousData: oldItem.toObject(),
        newData: updatedItem.toObject(),
        changedBy: req.userId,
        req,
      });

      return res.send({ message: `Item ${updatedItem.name} reativado.` });
    } catch (err) {
      return next(err);
    }
  }

  static async inative(req, res, next) {
    const { id } = req.params;
    try {
      const oldItem = await Item.findById(id);
      if (!oldItem) return next(new NotFound("Item não encontrado."));
      if (!oldItem.active) return next(new ErrorBase("Item já está inativo.", 400));

      const updatedItem = await Item.findByIdAndUpdate(
        id,
        {
          $set: {
            active: false,
            updatedAt: new Date(),
            updatedBy: req.userId,
          },
        },
        { new: true }
      );

      await AuditLogItemService.logItemAction({
        itemId: id,
        action: "INACTIVATE",
        previousData: oldItem.toObject(),
        newData: updatedItem.toObject(),
        changedBy: req.userId,
        req,
      });

      return res.send({ message: `Item ${updatedItem.name} inativado.` });
    } catch (err) {
      return next(err);
    }
  }
}
