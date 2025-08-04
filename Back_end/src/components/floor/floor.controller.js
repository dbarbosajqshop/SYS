import ErrorBase from "../../errors/base.error.js";
import NotFound from "../../errors/notFound.error.js";
import Build from "../build/schema/build.schema.js";
import FloorService from "./floor.service.js";
import Floor from "./schema/floor.schema.js";
import AuditLogStockService from "../stock/log/service/auditLogStock.service.js";

export default class FloorController {
  static async getAll(req, res, next) {
    try {
      const floors = await Floor.find({ active: true }).populate({
        path: "StockedItems",
        match: { active: true },
      });

      req.result = floors;
      next();
    } catch (err) {
      return next(err.message);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const floor = await Floor.findById(id);

      if (!floor || !floor.active) {
        return next(new NotFound("Andar não cadastrado."));
      }

      return res.send(floor);
    } catch (err) {
      return next(err.message);
    }
  }

  static async getLocal(req, res, next) {
    const { localCode } = req.params;

    try {
      const isFloorExisted = await Floor.findOne({ localCode });

      if (!isFloorExisted) return next(new NotFound(`Local não encontrado`));

      const local = await FloorService.parseCompleteFloorCode(localCode);
      return res.send(local);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    const { BuildId } = req.params;
    const { name, description, code } = req.body;
    try {
      const isBuildExisted = await Build.findById(BuildId);
      if (!isBuildExisted) {
        return next(new NotFound("Rua não encontrada para criar prédio."));
      }

      const isFloorExisted = await Floor.find({ name, code });
      if (isFloorExisted.length > 0) {
        return next(new ErrorBase("Conflito em floor já existente", 409));
      }

      const localCode = await FloorService.createLocalName(BuildId, code);
      const floorReceived = {
        BuildId,
        name,
        description,
        code,
        localCode,
        createdBy: req.userId,
      };

      const newFloor = new Floor(floorReceived);
      await newFloor.save();
      await isBuildExisted.Floors.push(newFloor._id);
      await isBuildExisted.save();

      await AuditLogStockService.logHierarchyAction({
        targetId: newFloor._id,
        parentId: BuildId,
        action: "CREATE",
        newData: newFloor.toObject(),
        changedBy: req.userId,
        hierarchyLevel: "FLOOR",
      });

      res.send(newFloor);
    } catch (err) {
      return next(err);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const { name, description, code } = req.body;
    const floorReceived = {
      $set: {
        name,
        description,
        code,
        updateAt: new Date(),
        updateBy: req.userId,
      },
    };
    try {
      const isFloorExisted = await Floor.findById(id);

      if (!isFloorExisted) {
        return next(new NotFound("Prédio não encontrado."));
      }

      const floorUpdated = await Floor.findByIdAndUpdate(id, floorReceived);
      await floorUpdated.save();
      const floor = await Floor.findById(id);

      await AuditLogStockService.logHierarchyAction({
        targetId: id,
        parentId: floor.BuildId,
        action: "UPDATE",
        previousData: isFloorExisted.toObject(),
        newData: floor.toObject(),
        changedBy: req.userId,
        hierarchyLevel: "FLOOR",
      });

      res.send(floor);
    } catch (err) {
      return next(err);
    }
  }

  static async reative(req, res, next) {
    const { id } = req.params;

    try {
      const isActiveFloor = await Floor.findOne({ _id: id, active: true });

      if (isActiveFloor !== null) {
        return next(new ErrorBase(`Prédio já está ativo.`, 400));
      }

      const floorInative = await Floor.findByIdAndUpdate(id, {
        $set: { active: true, updatedAt: new Date(), updatedBy: req.userId },
      });
      await floorInative.save();

      await AuditLogStockService.logHierarchyAction({
        targetId: id,
        parentId: floorInative.BuildId,
        action: "REACTIVATE",
        previousData: { active: false },
        newData: { active: true },
        changedBy: req.userId,
        hierarchyLevel: "FLOOR",
      });

      return res.send({ message: `Prédio ${floorInative.name} reativado.` });
    } catch (err) {
      return next(err);
    }
  }

  static async inative(req, res, next) {
    const { id } = req.params;

    try {
      const floor = await Floor.findById(id);

      if (!floor) {
        return next(new NotFound('Andar não encontrado.'));
      }

      if (!floor.active) {
        return next(new ErrorBase('Andar já está inativado.', 400));
      }

      await AuditLogStockService.logHierarchyAction({
        targetId: id,
        parentId: floor.BuildId,
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

      return res.send({ message: `Andar ${floor.name} inativado com sucesso.` });
    } catch (err) {
      return next(err);
    }
  }
}
