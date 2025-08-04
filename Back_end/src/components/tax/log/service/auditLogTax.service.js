import AuditLogTax from "../model/auditLogTax.model.js";
import Tax from "../../schema/tax.schema.js";

export default class AuditLogTaxService {
  static async logAction(action, userId, targetId, changes = [], targetType = 'Tax') {
    try {
      const tax = await Tax.findById(targetId);
      const targetName = tax ? `Taxa ${tax.name}` : "Taxa removida";
      
      const logEntry = new AuditLogTax({
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
      console.error("Erro ao registrar log de auditoria de taxa:", error);
      throw error;
    }
  }

  static async getChanges(oldData, newData) {
    const changes = [];
    const fieldsToTrack = [
      "name", 
      "retailTaxPercentage",
      "wholesaleTaxPercentage",
      "minWholesaleQuantity",
      "selected",
      "active"
    ];

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