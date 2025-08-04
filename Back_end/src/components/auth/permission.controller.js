import NotFound from "../../errors/notFound.error.js";
import Permission from "./schema/permission.schema.js";
import AuditLogUserService from "./log/service/auditLogUser.service.js";

export default class PermissionController {
  static async getAll(req, res, next) {
    try {
      const permissions = await Permission.find({ active: true });
      if (!permissions) return next(new NotFound('Nenhuma permission criada.'))
      req.result = permissions
      next();
    } catch (err) {
      return next(err);
    }
  }

  static async createPermission(req, res, next) {
    const { name } = req.body;

    try {
      const permissionAlreadyExist = await Permission.findOne({ name, active: true });
      if (permissionAlreadyExist) return next(new NotFound(`${permissionAlreadyExist.name} já existe!`));
      
      const permission = {
        name,
        createdBy: req.userId
      }
      
      const newPermission = new Permission(permission);
      await newPermission.save();

      await AuditLogUserService.logAction(
        "CREATE",
        req.userId,
        newPermission._id,
        [{ field: "name", newValue: name }]
      );

      res.send(newPermission);
    } catch (err) {
      return next(err);
    }
  }

  static async updatePermission(req, res, next) {
    const { id } = req.params;
    const { name } = req.body;

    try {
      const oldPermission = await Permission.findById(id);
      if (!oldPermission) return next(new NotFound("Permissão não encontrada."));

      const updatedPermission = await Permission.findByIdAndUpdate(
        id,
        { name },
        { new: true }
      );

      const changes = await AuditLogUserService.getChanges(
        oldPermission.toObject(),
        updatedPermission.toObject()
      );
      
      if (changes.length > 0) {
        await AuditLogUserService.logAction(
          "UPDATE",
          req.userId,
          id,
          changes
        );
      }

      res.send(updatedPermission);
    } catch (err) {
      return next(err);
    }
  }

  static async deletePermission(req, res, next) {
    const { id } = req.params;

    try {
      const permission = await Permission.findById(id);
      if (!permission) return next(new NotFound("Permissão não encontrada."));

      await Permission.findByIdAndUpdate(id, { active: false });

      await AuditLogUserService.logAction(
        "DELETE",
        req.userId,
        id,
        [{ field: "active", oldValue: true, newValue: false }]
      );

      res.send({ message: "Permissão desativada com sucesso." });
    } catch (err) {
      return next(err);
    }
  }
}