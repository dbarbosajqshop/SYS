import AuditLogItem from "../models/auditLogItem.model.js";

export default class AuditLogItemService {
  static async logItemAction({
    itemId,
    action,
    previousData,
    newData,
    changedBy,
    req
  }) {
    try {
      let changes = [];

      if (action === "UPDATE" && previousData && newData) {
        for (const key in newData) {
          if (key.startsWith('_') || key === 'updatedAt' || key === 'createdAt') continue;

          if (JSON.stringify(previousData[key]) !== JSON.stringify(newData[key])) {
            changes.push({
              field: key,
              oldValue: previousData[key],
              newValue: newData[key]
            });
          }
        }
      }
      else if (action === "CREATE" && newData) {
        for (const key in newData) {
          if (key.startsWith('_') || key === 'updatedAt' || key === 'createdAt') continue;

          if (newData[key] !== undefined) {
            changes.push({
              field: key,
              newValue: newData[key]
            });
          }
        }
      }
      else if (['INACTIVATE', 'REACTIVATE', 'UPDATE_PHOTO'].includes(action) && previousData && newData) {
        changes.push({
          field: action === 'UPDATE_PHOTO' ? 'imageUrl' : 'active',
          oldValue: action === 'UPDATE_PHOTO' ? previousData.imageUrl : previousData.active,
          newValue: action === 'UPDATE_PHOTO' ? newData.imageUrl : newData.active
        });
      }

      const logEntry = {
        action,
        userId: changedBy,
        targetId: itemId,
        targetType: "Item",
        targetName: newData?.name || previousData?.name,
        changes
      };

      await AuditLogItem.create(logEntry);
      return logEntry;
    } catch (error) {
      console.error("Failed to save item audit log:", error);
      throw error;
    }
  }

  static async getFilteredLogs({ userId, targetId, action, page = 1, limit = 10 }) {
    const filter = {};

    if (userId) filter.userId = userId;
    if (targetId) filter.targetId = targetId;
    if (action) filter.action = action.toUpperCase();

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    const logs = await AuditLogItem.find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .sort({ _id: -1 });

    return logs;
  }

}