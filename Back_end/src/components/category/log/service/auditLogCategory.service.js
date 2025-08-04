import AuditLogCategory from "../model/auditLogCategory.model.js";
import Category from "../../schemas/category.schema.js";

export default class AuditLogCategoryService {
  static async logAction(action, userId, targetId, changes = [], targetType = 'Category') {
    try {
      const category = await Category.findById(targetId);
      const targetName = category ? `Categoria ${category.name}` : "Categoria removida";

      const logEntry = new AuditLogCategory({
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
      console.error("Erro ao registrar log de auditoria de categoria:", error);
      throw error;
    }
  }

  static async getChanges(oldData, newData) {
    const changes = [];
    const fieldsToTrack = ["name", "description", "active"];

    for (const field of fieldsToTrack) {
      if (oldData[field]?.toString() !== newData[field]?.toString()) {
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