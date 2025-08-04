import ErrorBase from "../../errors/base.error.js";
import NotFound from "../../errors/notFound.error.js";
import Stock from "../stock/schemas/stock.schema.js";
import Street from "./schemas/street.schema.js"
import StreetService from "./street.service.js";
import AuditLogStockService from "../stock/log/service/auditLogStock.service.js";

export default class StreetController {
  static async getAll(req, res, next) {
    let { limit = 10, page = 1 } = req.query;
    try {
      const streets = await StreetService.paginable(req.query);

      const totalBuilds = streets.reduce((total, street) =>
        total + (street.Builds ? street.Builds.length : 0), 0);
      const totalFloors = streets.reduce((total, street) =>
        total + (street.Builds ? street.Builds.reduce((sum, build) =>
          sum + (build.Floors ? build.Floors.length : 0), 0) : 0), 0);
      const totalStockedItems = streets.reduce((total, street) =>
        total + (street.Builds ? street.Builds.reduce((sum, build) =>
          sum + (build.Floors ? build.Floors.reduce((count, floor) =>
            count + (floor.StockedItems ? floor.StockedItems.length : 0), 0) : 0), 0) : 0), 0);

      const streetsWithTotals = streets.map(street => {
        const buildCount = street.Builds ? street.Builds.length : 0;
        const floorCount = street.Builds ? street.Builds.reduce((sum, build) =>
          sum + (build.Floors ? build.Floors.length : 0), 0) : 0;
        const stockedItemCount = street.Builds ? street.Builds.reduce((sum, build) =>
          sum + (build.Floors ? build.Floors.reduce((count, floor) =>
            count + (floor.StockedItems ? floor.StockedItems.length : 0), 0) : 0), 0) : 0;

        return {
          ...street.toObject(),
          totals: {
            builds: buildCount,
            floors: floorCount,
            stockedItems: stockedItemCount
          }
        };
      });

      const totalItems = streets.length;
      const totalPages = Math.ceil(totalItems / limit);

      const response = {
        data: streetsWithTotals,
        totals: {
          totalBuilds,
          totalFloors,
          totalStockedItems
        },
        totalItems,
        totalPages,
        currentPage: page,
        limit
      };

      res.send(response);
    } catch (err) {
      console.error(err);
      if (err.message === 'Nenhum estoque cadastrado.') {
        return next(new NotFound('Nenhum estoque cadastrado.'));
      }
      return next(err.message);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const street = await Street.findById(id)
        .populate({
          path: 'Builds',
          select: 'name code _id description',
          match: { active: true },
          populate: {
            path: 'Floors',
            select: 'name code _id description',
            match: { active: true },
          }
        });

      if (!street || !street.active) {
        return next(new NotFound('Rua não cadastrada.'));
      }

      return res.send(street);
    } catch (err) {
      return next(err.message);
    }
  }

  static async create(req, res, next) {
    const { StockId } = req.params;
    const { name, code, description } = req.body;
    const streetReceived = {
      StockId,
      name,
      description,
      code,
      createdBy: req.userId
    }
    try {
      const isStockExisted = await Stock.findById(StockId);
      if (!isStockExisted) {
        return next(new NotFound('Estoque não encontrado para criar rua.'));
      }

      const isStreetExisted = await Street.find({ name, code })
      if (isStreetExisted.length > 0) {
        return next(new ErrorBase('Conflito em rua já existente', 409));
      }
      const newStreet = new Street(streetReceived);
      const streetSaved = await newStreet.save();
      await isStockExisted.Streets.push(streetSaved._id);
      await isStockExisted.save();

      await AuditLogStockService.logHierarchyAction({
        targetId: streetSaved._id,
        parentId: StockId,
        action: "CREATE",
        newData: streetSaved.toObject(),
        changedBy: req.userId,
        hierarchyLevel: "STREET",
      });

      res.send(streetSaved);
    } catch (err) {
      return next(err);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const { name, description, code } = req.body;
    const streetReceived = {
      $set:
      {
        name,
        description,
        code,
        updateAt: new Date(),
        updateBy: req.userId
      }
    }
    try {
      const isStreetExisted = await Street.findById(id);

      if (!isStreetExisted) {
        return next(new NotFound('Rua não encontrada.'))
      }

      const streetUpdated = await Street.findByIdAndUpdate(id, streetReceived)
      await streetUpdated.save()
      const street = await Street.findById(id)

      await AuditLogStockService.logHierarchyAction({
        targetId: id,
        parentId: street.StockId,
        action: "UPDATE",
        previousData: isStreetExisted.toObject(),
        newData: street.toObject(),
        changedBy: req.userId,
        hierarchyLevel: "STREET",
      });

      res.send(street)
    } catch (err) {
      return next(err)
    }
  }

  static async reative(req, res, next) {
    const { id } = req.params;

    try {
      const street = await Street.findById(id);

      if (!street) {
        return next(new NotFound('Rua não encontrada.'));
      }

      if (street.active) {
        return next(new ErrorBase('Rua já está ativa.', 400));
      }

      // Registrar log antes de reativar
      await AuditLogStockService.logHierarchyAction({
        targetId: id,
        parentId: street.StockId,
        action: "REACTIVATE",
        previousData: street.toObject(),
        newData: { active: true },
        changedBy: req.userId,
        hierarchyLevel: "STREET"
      });

      street.active = true;
      street.updatedAt = new Date();
      street.updatedBy = req.userId;
      await street.save();

      return res.send({ message: `Rua ${street.name} reativada.` })
    } catch (err) {
      return next(err);
    }
  }

  static async inative(req, res, next) {
    const { id } = req.params;

    try {
      const street = await Street.findById(id);

      if (!street) {
        return next(new NotFound('Rua não encontrada.'));
      }

      if (!street.active) {
        return next(new ErrorBase('Rua já está inativada.', 400));
      }

      await AuditLogStockService.logHierarchyAction({
        targetId: id,
        parentId: street.StockId,
        action: "INACTIVATE",
        previousData: street.toObject(),
        newData: { active: false },
        changedBy: req.userId,
        hierarchyLevel: "STREET"
      });

      street.active = false;
      street.updatedAt = new Date();
      street.updatedBy = req.userId;
      await street.save();

      return res.send({ message: `Rua ${street.name} inativada.` })
    } catch (err) {
      return next(err);
    }
  }
}