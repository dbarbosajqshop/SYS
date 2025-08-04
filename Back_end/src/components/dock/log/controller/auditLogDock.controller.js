import AuditLogDock from "../model/auditLogDock.route.js";

export default class AuditLogDockController {
  static async getAllLogs(req, res, next) {
    const { page = 1, limit = 10, action, userId, targetId } = req.query;
    const filter = {};

    if (action) filter.action = action.toUpperCase();
    if (userId) filter.userId = userId;
    if (targetId) filter.targetId = targetId;

    try {
      const logs = await AuditLogDock.find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("userId", "name email");

      const total = await AuditLogDock.countDocuments(filter);

      return res.json({
        data: logs,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error("Erro ao buscar logs de doca:", error);
      return next(error);
    }
  }
}