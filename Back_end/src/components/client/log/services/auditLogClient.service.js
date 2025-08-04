import AuditLogClient from "../model/auditLogClient.model.js";

export default class AuditLogClientService {
  static async logClientAction({
    targetId,
    action,
    previousData = {},
    newData = {},
    changedBy
  }) {
    try {
      const ignoredFields = ["_id", "createdAt", "updatedAt", "__v"];
      const changes = [];

      switch (action) {
        case "UPDATE":
          for (const key in newData) {
            if (ignoredFields.includes(key)) continue;

            const oldVal = JSON.stringify(previousData[key]);
            const newVal = JSON.stringify(newData[key]);

            if (oldVal !== newVal) {
              changes.push({
                field: key,
                oldValue: previousData[key],
                newValue: newData[key]
              });
            }
          }
          break;

        case "CREATE":
          for (const key in newData) {
            if (ignoredFields.includes(key)) continue;

            if (newData[key] !== undefined) {
              changes.push({
                field: key,
                newValue: newData[key]
              });
            }
          }
          break;

        case "INACTIVATE":
        case "REACTIVATE":
          changes.push({
            field: "active",
            oldValue: previousData.active,
            newValue: newData.active
          });
          break;

        case "ADD_VOUCHER":
          const lastVoucher = newData?.voucher?.at(-1);
          if (lastVoucher) {
            changes.push({
              field: "voucher",
              newValue: {
                code: lastVoucher.code,
                value: lastVoucher.value
              }
            });
          }
          break;

        default:
          console.warn(`Ação de log não reconhecida: ${action}`);
      }

      const logEntry = {
        action,
        userId: changedBy,
        targetId,
        clientName: newData?.name || previousData?.name,
        changes
      };

      await AuditLogClient.create(logEntry);
      return logEntry;
    } catch (error) {
      console.error("Erro ao registrar log do cliente:", error);
      throw error;
    }
  }
}
