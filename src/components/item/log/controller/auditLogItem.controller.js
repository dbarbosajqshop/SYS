import AuditLogItemService from "../service/auditLogItem.service.js";
import AuditLogItem from "../models/auditLogItem.model.js";

export default class AuditLogItemController {

  static async getItemLogsWithFilters(req, res, next) {
    try {
      const { page = 1, limit = 10, userId, targetId, action } = req.query;

      const logs = await AuditLogItemService.getFilteredLogs({ 
        userId, 
        targetId, 
        action, 
        page: parseInt(page), 
        limit: parseInt(limit) 
      });

      const populatedLogs = await AuditLogItem.populate(logs, [
        { path: "userId", select: "name email" },
        { path: "targetId", select: "name" }
      ]);

      res.send(populatedLogs);
    } catch (error) {
      next(error);
    }
  }
}
