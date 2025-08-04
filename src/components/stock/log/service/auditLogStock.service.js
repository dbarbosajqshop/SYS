import AuditLogStock from "../model/auditLogStock.model.js";
import Street from "../../../street/schemas/street.schema.js";
import Build from "../../../build/schema/build.schema.js";
import Stock from "../../schemas/stock.schema.js";

export default class AuditLogStockService {
  static async logStockAction({
    targetId,
    action,
    previousData = {},
    newData = {},
    changedBy,
    hierarchy = {}
  }) {
    try {
      const ignoredFields = ["_id", "createdAt", "updatedAt", "__v", "active"];
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
                newValue: newData[key],
                hierarchyLevel: "STOCK"
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
                newValue: newData[key],
                hierarchyLevel: "STOCK"
              });
            }
          }
          break;

        case "INACTIVATE":
        case "REACTIVATE":
          changes.push({
            field: "active",
            oldValue: previousData.active,
            newValue: newData.active,
            hierarchyLevel: "STOCK"
          });
          break;

        default:
          console.warn(`Ação de log não reconhecida: ${action}`);
      }

      const logEntry = {
        action,
        userId: changedBy,
        targetId,
        targetModel: 'Stock',
        stockName: newData?.name || previousData?.name,
        hierarchy,
        changes
      };

      await AuditLogStock.create(logEntry);
      return logEntry;
    } catch (error) {
      console.error("Erro ao registrar log do estoque:", error);
      throw error;
    }
  }

  static async logHierarchyAction({
    targetId,
    parentId,
    action,
    previousData = {},
    newData = {},
    changedBy,
    hierarchyLevel
  }) {
    try {
      const ignoredFields = ["_id", "createdAt", "updatedAt", "__v", "active"];
      const changes = [];
      let hierarchy = {};

      switch (hierarchyLevel) {
        case "STREET":
          hierarchy = { streetId: targetId };
          break;
        case "BUILD":
          hierarchy = { 
            streetId: parentId,
            buildId: targetId 
          };
          break;
        case "FLOOR":
          const build = await Build.findById(parentId);
          hierarchy = { 
            streetId: build.StreetId,
            buildId: parentId,
            floorId: targetId 
          };
          break;
      }

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
                newValue: newData[key],
                hierarchyLevel
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
                newValue: newData[key],
                hierarchyLevel
              });
            }
          }
          break;

        case "INACTIVATE":
        case "REACTIVATE":
          changes.push({
            field: "active",
            oldValue: previousData.active,
            newValue: newData.active,
            hierarchyLevel
          });
          break;

        default:
          console.warn(`Ação de log não reconhecida: ${action}`);
      }

      let stockId;
      let targetModel;
      if (hierarchyLevel === "STREET") {
        stockId = parentId;
        targetModel = 'Street';
      } else if (hierarchyLevel === "BUILD") {
        const street = await Street.findById(parentId);
        stockId = street.StockId;
        targetModel = 'Build';
      } else if (hierarchyLevel === "FLOOR") {
        const build = await Build.findById(parentId);
        const street = await Street.findById(build.StreetId);
        stockId = street.StockId;
        targetModel = 'Floor';
      }

      const stock = await Stock.findById(stockId);

      const logEntry = {
        action,
        userId: changedBy,
        targetId,
        targetModel,
        stockName: stock.name,
        hierarchy,
        changes
      };

      await AuditLogStock.create(logEntry);
      return logEntry;
    } catch (error) {
      console.error(`Erro ao registrar log de ${hierarchyLevel}:`, error);
      throw error;
    }
  }

  static async logHierarchyInactivation({
    stockId,
    changedBy,
    previousData,
    hierarchyCounts
  }) {
    try {
      const stock = await Stock.findById(stockId);
      
      const logEntry = {
        action: "INACTIVATE_HIERARCHY",
        userId: changedBy,
        targetId: stockId,
        targetModel: 'Stock',
        stockName: stock.name,
        hierarchyDetails: hierarchyCounts,
        changes: [{
          field: 'hierarchy',
          oldValue: previousData,
          newValue: { active: false },
          hierarchyLevel: "STOCK"
        }]
      };

      await AuditLogStock.create(logEntry);
      return logEntry;
    } catch (error) {
      console.error("Erro ao registrar inativação hierárquica:", error);
      throw error;
    }
  }
}