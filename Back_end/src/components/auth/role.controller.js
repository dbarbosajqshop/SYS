import mongoose from "mongoose";
import NotFound from "../../errors/notFound.error.js";
import Role from "./schema/role.schema.js";
import User from "./schema/user.schema.js";
import Permission from "./schema/permission.schema.js";
import { roles } from "./role.mapped.js";
import AuditLogUserService from "./log/service/auditLogUser.service.js";

export default class RoleController {
  static async getAll(req, res, next) {
    try {
      const roles = await Role.find({ active: true }).populate({
        path: "permissions",
        match: { active: true },
        select: "name",
      });
      if (!roles) return next(new NotFound("Nenhuma role criada."));
      req.result = roles;
      next();
    } catch (err) {
      return next(err);
    }
  }

  static async listRoles(req, res, next) {
    try {
      const roles = await Role.find({ active: true })
        .populate({
          path: "permissions",
          match: { active: true },
          select: "name",
        })
        .sort({ name: 1 });
      if (!roles) return next(new NotFound("Nenhuma role criada."));
      res.send(roles);
    } catch (err) {
      return next(err);
    }
  }

  static async configurateRoles(req, res, next) {
    const permissions = await Permission.find({ active: true });
    for (const role of roles) {
      const permissionIds = [];

      for (const permissionName of role.permissions) {
        let existentPermission = permissions.find(
          (permission) => permission.name === permissionName
        );

        if (!existentPermission) {
          const newPermission = new Permission({ name: permissionName });
          existentPermission = await newPermission.save();
          
          await AuditLogUserService.logAction(
            "CREATE",
            req.userId,
            existentPermission._id,
            [{ field: "name", newValue: permissionName }]
          );
        }

        permissionIds.push(existentPermission._id);
      }

      const roleAlreadyExist = await Role.findOne({ name: role.name });

      let newRole = null;
      if (!roleAlreadyExist) {
        newRole = new Role({ name: role.name });
        await newRole.save();
        
        await AuditLogUserService.logAction(
          "CREATE",
          req.userId,
          newRole._id,
          [{ field: "name", newValue: role.name }]
        );
      }

      const updatedRole = await Role.findByIdAndUpdate(
        newRole?._id || roleAlreadyExist?._id,
        { $addToSet: { permissions: { $each: permissionIds } } },
        { new: true }
      );

      if (updatedRole.permissions.length > 0) {
        await AuditLogUserService.logAction(
          "UPDATE",
          req.userId,
          updatedRole._id,
          [{ field: "permissions", newValue: updatedRole.permissions }]
        );
      }
    }

    res.status(200).send("Roles updated successfully");
  }

  static async createRole(req, res, next) {
    const { name } = req.body;

    try {
      const roleAlreadyExist = await Role.findOne({ name, active: true });
      if (roleAlreadyExist)
        return next(new NotFound(`${roleAlreadyExist.name} já existe!`));
      
      const role = {
        name,
        createdBy: req.userId,
      };
      
      const newRole = new Role(role);
      await newRole.save();

      await AuditLogUserService.logAction(
        "CREATE",
        req.userId,
        newRole._id,
        [{ field: "name", newValue: name }]
      );

      res.send(newRole);
    } catch (err) {
      return next(err);
    }
  }

  static async syncRoleAtUser(req, res, next) {
    const { userId, roleId, roleName } = req.body;
    try {
      if (!userId) return next(new NotFound("User não informado."));
      if (!roleId && !roleName) return next(new NotFound("Role não informada."));

      const user = await User.findById(userId);
      if (!user) return next(new NotFound("User não encontrado."));

      let role = await Role.findById(roleId);
      if (!role) {
        role = await Role.findOne({ name: roleName, active: true });
        if (!role) return next(new NotFound(`O cargo não foi encontrado.`));
      }

      const roleAlreadySync = await User.findOne({
        _id: userId,
        Roles: { $in: [role._id] },
      });
      if (roleAlreadySync)
        return next(
          new NotFound(`O user: ${roleAlreadySync.name}, já tem o cargo ${role.name}`)
        );

      const oldUserData = await User.findById(userId);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $addToSet: { Roles: role._id } },
        { new: true }
      );

      const changes = await AuditLogUserService.getChanges(oldUserData.toObject(), updatedUser.toObject());
      if (changes.length > 0) {
        await AuditLogUserService.logAction(
          "UPDATE",
          req.userId,
          userId,
          changes
        );
      }

      return res.send(updatedUser);
    } catch (err) {
      return next(err.message);
    }
  }

  static async syncRolesAtUser(req, res, next) {
    const { userId, roleIds, roleNames } = req.body;

    try {
      if (!userId) return next(new NotFound("Usuário não informado."));
      if (!roleIds && !roleNames) return next(new NotFound("Nenhum cargo informado."));

      const user = await User.findById(userId);
      if (!user) return next(new NotFound("Usuário não encontrado."));

      let roles = [];
      if (roleIds && roleIds.length > 0) {
        const rolesByIds = await Role.find({
          _id: { $in: roleIds },
          active: true,
        });
        roles = roles.concat(rolesByIds);
      }

      if (roleNames && roleNames.length > 0) {
        const rolesByNames = await Role.find({
          name: { $in: roleNames },
          active: true,
        });
        roles = roles.concat(rolesByNames);
      }

      if (roles.length === 0) {
        return next(new NotFound("Nenhum cargo válido encontrado."));
      }

      const oldUserData = await User.findById(userId);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { Roles: roles.map((role) => role._id) } },
        { new: true }
      );

      const changes = await AuditLogUserService.getChanges(oldUserData.toObject(), updatedUser.toObject());
      if (changes.length > 0) {
        await AuditLogUserService.logAction(
          "UPDATE",
          req.userId,
          userId,
          changes
        );
      }

      return res.status(200).send(updatedUser);
    } catch (err) {
      return next(err.message);
    }
  }

  static async addPermissionToRole(req, res, next) {
    const { roleId, permissionId, roleName, permissionName } = req.body;

    try {
      if (!roleId && !roleName) return next(new NotFound("Role não informada."));
      if (!permissionId && !permissionName)
        return next(new NotFound("Permissão não informada."));

      let role = await Role.findById(roleId);
      if (!role) {
        role = await Role.findOne({ name: roleName, active: true });
        if (!role) return next(new NotFound(`O cargo não foi encontrado.`));
      }

      let permission = await Permission.findById(permissionId);
      if (!permission) {
        permission = await Permission.findOne({
          name: permissionName,
          active: true,
        });
        if (!permission) return next(new NotFound(`A permissão não foi encontrada.`));
      }

      const oldRoleData = await Role.findById(role._id);
      const updatedRole = await Role.findByIdAndUpdate(
        role._id,
        { $addToSet: { permissions: permission._id } },
        { new: true }
      );

      const changes = await AuditLogUserService.getChanges(oldRoleData.toObject(), updatedRole.toObject());
      if (changes.length > 0) {
        await AuditLogUserService.logAction(
          "UPDATE",
          req.userId,
          role._id,
          changes
        );
      }

      return res.send(updatedRole);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
}