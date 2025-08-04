import ErrorBase from "../../errors/base.error.js";
import NotFound from "../../errors/notFound.error.js";
import DockService from "./dock.service.js";
import Dock from "./schemas/dock.schema.js";
import AuditLogDockService from "../dock/log/service/auditLogDock.service.js";

export default class DockController {
  static async getAll(req, res, next) {
    let { limit = 10, page = 1 } = req.query;
    try {
      req.query.ordenacao = "code:1";
      const docks = await DockService.paginable(req.query);

      const totalItems = docks.length;
      const totalPages = Math.ceil(totalItems / limit);

      const response = {
        data: docks,
        totalItems,
        totalPages,
        currentPage: page,
        limit,
      };


      res.send(response);
    } catch (err) {
      console.error(err);
      if (err.message === "Nenhuma Doca cadastrada.") {
        return next(new NotFound("Nenhuma Doca cadastrada."));
      }
      return next(err.message);
    }
  }

  static async getAllList(req, res, next) {
    try {
      const docks = await Dock.find({ active: true }).sort({
        createdAt: 1,
      });

      if (docks.length < 1) {
        return next(new NotFound("Nenhuma Doca cadastrada."));
      }

      res.send(docks);
    } catch (err) {
      return next(err.message);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const dock = await Dock.findOne({
        _id: id,
        active: true,
      });

      if (!dock) {
        return next(new NotFound("Doca não cadastrada."));
      }

      return res.send(dock);
    } catch (err) {
      return next(err.message);
    }
  }

  static async create(req, res, next) {
    const { code } = req.body;
    const dockReceived = {
      code: code.toUpperCase(),
      createdBy: req.userId,
    };
    try {
      const isDockExisted = await Dock.find({ code });

      if (isDockExisted.length > 0) {
        return next(new ErrorBase("Conflito em Doca já existente", 409));
      }

      const newDock = new Dock(dockReceived);
      await newDock.save();

      await AuditLogDockService.logAction(
        "CREATE",
        req.userId,
        newDock._id,
        [],
        "Dock"
      );

      res.send(newDock);
    } catch (err) {
      return next(err);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const { code } = req.body;
    const dockReceived = {
      $set: {
        code: code.toUpperCase(),
        updatedAt: new Date(),
        updatedBy: req.userId,
      },
    };
    try {
      const oldDock = await Dock.findById(id);

      if (!oldDock) {
        return next(new NotFound("Doca não encontrada."));
      }

      const isDockExistedName = await Dock.find({ code });

      if (isDockExistedName.length > 0) {
        return next(new ErrorBase("Conflito em Doca já existente", 409));
      }

      const dockUpdated = await Dock.findByIdAndUpdate(id, dockReceived);
      const newDock = await Dock.findById(id);

      const changes = await AuditLogDockService.getChanges(
        oldDock.toObject(),
        newDock.toObject()
      );
      await AuditLogDockService.logAction(
        "UPDATE",
        req.userId,
        id,
        changes,
        "Dock"
      );

      res.send(newDock);
    } catch (err) {
      return next(err);
    }
  }

  static async reative(req, res, next) {
    const { id } = req.params;

    try {
      const isDeletedDock = await Dock.findOne({
        _id: id,
        active: true,
      });

      if (isDeletedDock !== null) {
        return next(new ErrorBase(`Doca já está ativa.`, 400));
      }

      const dockInative = await Dock.findByIdAndUpdate(id, {
        $set: { active: true, updatedAt: new Date(), updatedBy: req.userId },
      });

      await AuditLogDockService.logAction(
        "REACTIVATE",
        req.userId,
        id,
        [{ field: "active", oldValue: false, newValue: true }],
        "Dock"
      );

      return res.send({
        message: `Doca reativada.`,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async inative(req, res, next) {
    const { id } = req.params;

    try {
      const isActiveDock = await Dock.findOne({
        _id: id,
        active: false,
      });

      if (isActiveDock !== null) {
        return next(new ErrorBase(`Doca já está inativada.`, 400));
      }

      const dockInative = await Dock.findByIdAndUpdate(id, {
        $set: { active: false, updatedAt: new Date(), updatedBy: req.userId },
      });

      await AuditLogDockService.logAction(
        "INACTIVATE",
        req.userId,
        id,
        [{ field: "active", oldValue: true, newValue: false }],
        "Dock"
      );

      return res.send({
        message: `Doca inativada.`,
      });
    } catch (err) {
      return next(err);
    }
  }
}
