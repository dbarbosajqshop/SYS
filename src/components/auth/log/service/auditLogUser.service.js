import AuditLogUser from "../models/auditLogUser.model.js";
import User from "../../schema/user.schema.js";
import Role from "../../schema/role.schema.js";
import Permission from "../../schema/permission.schema.js";

export default class AuditLogUserService {
  static async logAction(action, userId, targetId, changes = [], targetType = 'User') {
    try {
      let targetName = "Registro removido";
      
      switch(targetType) {
        case 'User':
          const user = await User.findById(targetId);
          targetName = user ? user.name : "Usuário removido";
          break;
        case 'Role':
          const role = await Role.findById(targetId);
          targetName = role ? role.name : "Cargo removido";
          break;
        case 'Permission':
          const permission = await Permission.findById(targetId);
          targetName = permission ? permission.name : "Permissão removida";
          break;
      }
      
      const logEntry = new AuditLogUser({
        action,
        userId,
        targetId,
        targetType,
        targetName,
        changes,
        timestamp: new Date()
      });
      
      await logEntry.save();
      return logEntry;
    } catch (error) {
      console.error("Erro ao registrar log de auditoria:", error);
    }
  }

  static async getChanges(oldData, newData) {
    const changes = [];
    const fieldsToTrack = ["name", "email", "Roles", "permissions", "active"];

    for (const field of fieldsToTrack) {
      if (oldData[field] !== newData[field]) {
        changes.push({
          field,
          oldValue: oldData[field],
          newValue: newData[field]
        });
      }
    }

    return changes;
  }
}