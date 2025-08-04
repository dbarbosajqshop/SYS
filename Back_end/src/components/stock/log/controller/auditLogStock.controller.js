import AuditLogStock from "../model/auditLogStock.model.js";

export default class AuditLogStockController {
  static async getStockAuditLogs(req, res, next) {
    const {
      targetId,
      userId,
      action,
      hierarchyLevel,
      includeHierarchy,
      page = 1,
      limit = 10
    } = req.query;

    try {
      const filter = {
        ...(targetId && { targetId }),
        ...(userId && { userId }),
        ...(action && { action: action.toUpperCase() }),
        ...(hierarchyLevel && { "changes.hierarchyLevel": hierarchyLevel.toUpperCase() }),
        ...(includeHierarchy === 'true' && {
          $or: [
            { action: 'INACTIVATE_HIERARCHY' },
            { 'changes.hierarchyLevel': { $exists: true } }
          ]
        })
      };

      const options = {
        skip: (page - 1) * limit,
        limit: parseInt(limit),
        sort: { createdAt: -1 }
      };

      const logs = await AuditLogStock.find(filter, null, options)
        .populate([
          { path: "userId", select: "name email" },
          { path: "targetId", select: "name code" },
          { path: "hierarchy.streetId", select: "name code" },
          { path: "hierarchy.buildId", select: "name code" },
          { path: "hierarchy.floorId", select: "name code" }
        ]);

      const total = await AuditLogStock.countDocuments(filter);

      res.send({
        data: logs,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }
}