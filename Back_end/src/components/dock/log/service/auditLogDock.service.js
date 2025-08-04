import AuditLogDock from "../model/auditLogDock.route.js";
import Dock from "../../schemas/dock.schema.js";

export default class AuditLogDockService {
  static async logAction(action, userId, targetId, changes = [], targetType = 'Dock') {
    try {
      const dock = await Dock.findById(targetId);
      const targetName = dock ? `Doca ${dock.code}` : "Doca removida";

      const logEntry = new AuditLogDock({
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
      console.error("Erro ao registrar log de auditoria de doca:", error);
      throw error;
    }
  }

  static async getChanges(oldData, newData) {
    const changes = [];
    const fieldsToTrack = ["code", "active"];

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