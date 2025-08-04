import AuditLogClient from "../model/auditLogClient.model.js";

export default class AuditLogClientController {
  static async getClientAuditLogs(req, res, next) {
    const {
      targetId,
      userId,
      action,
      page = 1,
      limit = 10
    } = req.query;

    const filter = {};
    if (targetId) filter.targetId = targetId;
    if (userId) filter.userId = userId;
    if (action) filter.action = action.toUpperCase();

    const skip = (page - 1) * limit;

    try {
      const logs = await AuditLogClient.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate("userId", "name email")
        .populate("targetId", "name");

      res.send(logs);
    } catch (error) {
      next(error);
    }
  }
}
