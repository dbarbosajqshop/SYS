import ErrorBase from "../../errors/base.error.js";
import NotFound from "../../errors/notFound.error.js";
import Street from "../street/schemas/street.schema.js";
import Build from "./schema/build.schema.js";
import AuditLogStockService from "../stock/log/service/auditLogStock.service.js";

export default class BuildController {
  static async getAll(req, res, next) {
    try {
      const builds = await Build.find({ active: true }).populate({
        path: "Floors",
        select: "name code _id description",
        match: { active: true },
      });

      if (builds.length <= 0) {
        return next(new NotFound("Nenhum prédio cadastrado."));
      }

      req.result = builds;
      next();
    } catch (err) {
      return next(err.message);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const build = await Build.findById(id).populate({
        path: "Floors",
        select: "name code _id description",
        match: { active: true },
      });

      if (!build || !build.active) {
        return next(new NotFound("Prédio não cadastrado."));
      }

      return res.send(build);
    } catch (err) {
      return next(err.message);
    }
  }

  static async create(req, res, next) {
    const { StreetId } = req.params;
    const { name, description, code } = req.body;
    const buildReceived = {
      StreetId,
      name,
      description,
      code,
      createdBy: req.userId,
    };
    try {
      const isStreetExisted = await Street.findById(StreetId);
      if (!isStreetExisted) {
        return next(new NotFound("Rua não encontrada para criar prédio."));
      }

      const isBuildExisted = await Build.find({ name, code });
      if (isBuildExisted.length > 0) {
        return next(new ErrorBase("Conflito em build já existente", 409));
      }

      const newBuild = new Build(buildReceived);
      await newBuild.save();
      await isStreetExisted.Builds.push(newBuild._id);
      await isStreetExisted.save();

      try {
        await AuditLogStockService.logHierarchyAction({
          targetId: newBuild._id,
          parentId: StreetId,
          action: "CREATE",
          newData: newBuild.toObject(),
          changedBy: req.userId,
          hierarchyLevel: "BUILD",
        });
      } catch (logError) {
        console.error("Erro ao registrar log (não crítico):", logError);
      }

      res.send(newBuild);
    } catch (err) {
      return next(err);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const { name, description, code } = req.body;
    const buildReceived = {
      $set: {
        name,
        description,
        code,
        updateAt: new Date(),
        updateBy: req.userId,
      },
    };
    try {
      const isBuildExisted = await Build.findById(id);

      if (!isBuildExisted) {
        return next(new NotFound("Prédio não encontrado."));
      }

      const buildUpdated = await Build.findByIdAndUpdate(id, buildReceived);
      await buildUpdated.save();
      const build = await Build.findById(id);

      await AuditLogStockService.logHierarchyAction({
        targetId: id,
        parentId: build.StreetId,
        action: "UPDATE",
        previousData: isBuildExisted.toObject(),
        newData: build.toObject(),
        changedBy: req.userId,
        hierarchyLevel: "BUILD",
      });

      res.send(build);
    } catch (err) {
      return next(err);
    }
  }

  static async reative(req, res, next) {
    const { id } = req.params;

    try {
      const isActiveBuild = await Build.findOne({ _id: id, active: true });

      if (isActiveBuild !== null) {
        return next(new ErrorBase(`Prédio já está ativo.`, 400));
      }

      const buildInative = await Build.findByIdAndUpdate(id, {
        $set: { active: true, updatedAt: new Date(), updatedBy: req.userId },
      });
      await buildInative.save();

      await AuditLogStockService.logHierarchyAction({
        targetId: id,
        parentId: buildInative.StreetId,
        action: "REACTIVATE",
        previousData: { active: false },
        newData: { active: true },
        changedBy: req.userId,
        hierarchyLevel: "BUILD",
      });

      return res.send({ message: `Prédio ${buildInative.name} reativado.` });
    } catch (err) {
      return next(err);
    }
  }

  static async inative(req, res, next) {
    const { id } = req.params;

    try {
      const build = await Build.findById(id);

      if (!build) {
        return next(new NotFound('Prédio não encontrado.'));
      }

      if (!build.active) {
        return next(new ErrorBase('Prédio já está inativado.', 400));
      }

      await AuditLogStockService.logHierarchyAction({
        targetId: id,
        parentId: build.StreetId,
        action: "INACTIVATE",
        previousData: build.toObject(),
        newData: { active: false },
        changedBy: req.userId,
        hierarchyLevel: "BUILD"
      });

      build.active = false;
      build.updatedAt = new Date();
      build.updatedBy = req.userId;
      await build.save();

      return res.send({ message: `Prédio ${build.name} inativado com sucesso.` });
    } catch (err) {
      return next(err);
    }
  }
}
