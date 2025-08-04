import AuditLogUser from "../models/auditLogUser.model.js";
import User from "../../schema/user.schema.js";

export default class AuditLogUserController {
  static async getAllLogs(req, res, next) {
    const { page = 1, limit = 10, action, userId, targetId } = req.query;
    const filter = {};

    if (action) filter.action = action.toUpperCase();
    if (userId) filter.userId = userId; 
    if (targetId) filter.targetId = targetId; 

    try {
      const logs = await AuditLogUser.find(filter)
        .sort({ timestamp: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("userId", "name email") 
        .populate("targetId", "name email"); 

      const total = await AuditLogUser.countDocuments(filter);

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
      console.error("Erro ao buscar todos os logs:", error);
      return next(error);
    }
  }


}