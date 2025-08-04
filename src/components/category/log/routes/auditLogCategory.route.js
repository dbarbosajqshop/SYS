import express from "express";
import AuditLogCategoryController from "../controller/auditLogCategory.controller.js";

const router = express.Router();

router.get("/audit-logs/category", AuditLogCategoryController.getAllLogs);

export default router;