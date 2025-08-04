import express from "express";
import AuditLogDockController from "../controller/auditLogDock.controller.js";

const router = express.Router();

router.get("/audit-logs/dock", AuditLogDockController.getAllLogs);

export default router;