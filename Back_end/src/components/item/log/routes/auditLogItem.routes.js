import express from "express";
import AuditLogItemController from "../controller/auditLogItem.controller.js";

const router = express.Router();

router.get("/audit-logs/item", AuditLogItemController.getItemLogsWithFilters);

export default router;