import ErrorBase from "../../errors/base.error.js";
import NotFound from "../../errors/notFound.error.js";
import Stock from "./schemas/stock.schema.js";
import StockService from "./stock.service.js";
import AuditLogStockService from "../stock/log/service/auditLogStock.service.js";

export default class StockController {
  static async getAll(req, res, next) {
    let { limit = 10, page = 1 } = req.query;
    req.query.ordenacao = "name:1";
    try {
      const stocks = await StockService.paginable(req.query);

      const totalStreets = stocks.reduce(
        (total, stock) => total + (stock.Streets ? stock.Streets.length : 0),
        0
      );
      const totalBuilds = stocks.reduce(
        (total, stock) =>
          total +
          (stock.Streets
            ? stock.Streets.reduce(
              (sum, street) =>
                sum + (street.Builds ? street.Builds.length : 0),
              0
            )
            : 0),
        0
      );
      const totalFloors = stocks.reduce(
        (total, stock) =>
          total +
          (stock.Streets
            ? stock.Streets.reduce(
              (sum, street) =>
                sum +
                (street.Builds
                  ? street.Builds.reduce(
                    (count, build) =>
                      count + (build.Floors ? build.Floors.length : 0),
                    0
                  )
                  : 0),
              0
            )
            : 0),
        0
      );
      const totalStockedItems = stocks.reduce(
        (total, stock) =>
          total +
          (stock.Streets
            ? stock.Streets.reduce(
              (sum, street) =>
                sum +
                (street.Builds
                  ? street.Builds.reduce(
                    (count, build) =>
                      count +
                      (build.Floors
                        ? build.Floors.reduce(
                          (increment, floor) =>
                            increment +
                            (floor.StockedItems
                              ? floor.StockedItems.length
                              : 0),
                          0
                        )
                        : 0),
                    0
                  )
                  : 0),
              0
            )
            : 0),
        0
      );

      const stocksWithTotals = stocks.map((stock) => {
        const streetCount = stock.Streets ? stock.Streets.length : 0;
        const buildCount = stock.Streets
          ? stock.Streets.reduce(
            (sum, street) => sum + (street.Builds ? street.Builds.length : 0),
            0
          )
          : 0;
        const floorCount = stock.Streets
          ? stock.Streets.reduce(
            (sum, street) =>
              sum +
              (street.Builds
                ? street.Builds.reduce(
                  (count, build) =>
                    count + (build.Floors ? build.Floors.length : 0),
                  0
                )
                : 0),
            0
          )
          : 0;

        const stockedItemsCount = stock.Streets
          ? stock.Streets.reduce(
            (sum, street) =>
              sum +
              (street.Builds
                ? street.Builds.reduce(
                  (count, build) =>
                    count +
                    (build.Floors
                      ? build.Floors.reduce(
                        (increment, floor) =>
                          increment +
                          (floor.StockedItems
                            ? floor.StockedItems.length
                            : 0),
                        0
                      )
                      : 0),
                  0
                )
                : 0),
            0
          )
          : 0;

        return {
          ...stock.toObject(),
          totals: {
            streets: streetCount,
            builds: buildCount,
            floors: floorCount,
            stockedItems: stockedItemsCount,
          },
        };
      });

      const totalItems = stocks.length;
      const totalPages = Math.ceil(totalItems / limit);

      const response = {
        data: stocksWithTotals,
        totals: {
          totalStreets,
          totalBuilds,
          totalFloors,
          totalStockedItems,
        },
        totalItems,
        totalPages,
        currentPage: page,
        limit,
      };

      res.send(response);
    } catch (err) {
      console.error(err);
      if (err.message === "Nenhum estoque cadastrado.") {
        return next(new NotFound("Nenhum estoque cadastrado."));
      }
      return next(err.message);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const stock = await Stock.findById(id).populate({
        path: "Streets",
        select: "name code _id description",
        match: { active: true },
        populate: {
          path: "Builds",
          select: "name code _id description",
          match: { active: true },
          populate: {
            path: "Floors",
            select: "name code _id description",
            match: { active: true },
          },
        },
      });

      if (!stock || !stock.active) {
        return next(new NotFound("Estoque não cadastrado."));
      }

      return res.send(stock);
    } catch (err) {
      return next(err.message);
    }
  }

  static async create(req, res, next) {
    const { name, description, code } = req.body;
    const stockReceived = {
      name,
      description,
      code,
      createdBy: req.userId,
    };
    try {
      const isStockExisted = await Stock.find({ name, code });

      if (isStockExisted.length > 0) {
        return next(new ErrorBase("Conflito em stock já existente", 409));
      }

      const newStock = new Stock(stockReceived);
      await newStock.save();

      await AuditLogStockService.logStockAction({
        targetId: newStock._id,
        action: "CREATE",
        newData: newStock.toObject(),
        changedBy: req.userId,
      });

      res.send(newStock);
    } catch (err) {
      return next(err);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const { name, description, code } = req.body;
    const stockReceived = {
      $set: {
        name,
        description,
        code,
        updateAt: new Date(),
        updateBy: req.userId,
      },
    };
    try {
      const isStockExisted = await Stock.findById(id);

      if (!isStockExisted) {
        return next(new NotFound("Estoque não encontrado."));
      }

      const stockUpdated = await Stock.findByIdAndUpdate(id, stockReceived);
      await stockUpdated.save();
      const stock = await Stock.findById(id);

      await AuditLogStockService.logStockAction({
        targetId: id,
        action: "UPDATE",
        previousData: isStockExisted.toObject(),
        newData: stock.toObject(),
        changedBy: req.userId,
      });

      res.send(stock);
    } catch (err) {
      return next(err);
    }
  }

  static async inative(req, res, next) {
    const { id } = req.params;

    try {
      const stock = await Stock.findById(id).populate({
        path: 'Streets',
        match: { active: true },
        populate: {
          path: 'Builds',
          match: { active: true },
          populate: {
            path: 'Floors',
            match: { active: true }
          }
        }
      });

      if (!stock) {
        return next(new NotFound('Estoque não encontrado.'));
      }

      if (!stock.active) {
        return next(new ErrorBase('Estoque já está inativado.', 400));
      }

      // Contagem de itens da hierarquia
      const hierarchyCounts = {
        streets: stock.Streets.length,
        builds: stock.Streets.reduce((sum, street) => sum + street.Builds.length, 0),
        floors: stock.Streets.reduce((sum, street) =>
          sum + street.Builds.reduce((count, build) => count + build.Floors.length, 0), 0)
      };

      // Registra log principal
      await AuditLogStockService.logHierarchyInactivation({
        stockId: id,
        changedBy: req.userId,
        previousData: stock.toObject(),
        hierarchyCounts
      });

      // Inativação em cascata
      for (const street of stock.Streets) {
        await AuditLogStockService.logHierarchyAction({
          targetId: street._id,
          parentId: id,
          action: "INACTIVATE",
          previousData: street.toObject(),
          newData: { active: false },
          changedBy: req.userId,
          hierarchyLevel: "STREET"
        });

        for (const build of street.Builds) {
          await AuditLogStockService.logHierarchyAction({
            targetId: build._id,
            parentId: street._id,
            action: "INACTIVATE",
            previousData: build.toObject(),
            newData: { active: false },
            changedBy: req.userId,
            hierarchyLevel: "BUILD"
          });

          for (const floor of build.Floors) {
            await AuditLogStockService.logHierarchyAction({
              targetId: floor._id,
              parentId: build._id,
              action: "INACTIVATE",
              previousData: floor.toObject(),
              newData: { active: false },
              changedBy: req.userId,
              hierarchyLevel: "FLOOR"
            });

            floor.active = false;
            floor.updatedAt = new Date();
            floor.updatedBy = req.userId;
            await floor.save();
          }

          build.active = false;
          build.updatedAt = new Date();
          build.updatedBy = req.userId;
          await build.save();
        }

        street.active = false;
        street.updatedAt = new Date();
        street.updatedBy = req.userId;
        await street.save();
      }

      // Inativa o estoque
      stock.active = false;
      stock.updatedAt = new Date();
      stock.updatedBy = req.userId;
      await stock.save();

      return res.send({
        success: true,
        message: `Estoque ${stock.name} inativado com sucesso.`,
        hierarchyInactivated: hierarchyCounts
      });
    } catch (error) {
      return next(error);
    }
  }

  static async reative(req, res, next) {
    const { id } = req.params;

    try {
      const stock = await Stock.findById(id);

      if (!stock) {
        return next(new NotFound('Estoque não encontrado.'));
      }

      if (stock.active) {
        return next(new ErrorBase('Estoque já está ativo.', 400));
      }

      await AuditLogStockService.logAction({
        targetId: id,
        action: "REACTIVATE",
        previousData: stock.toObject(),
        newData: { active: true },
        changedBy: req.userId
      });

      stock.active = true;
      stock.updatedAt = new Date();
      stock.updatedBy = req.userId;
      await stock.save();

      return res.send({ message: `Estoque ${stock.name} reativado com sucesso.` });
    } catch (err) {
      return next(err);
    }
  }

}
