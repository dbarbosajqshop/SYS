import express from "express";
import AuditLogStockController from "../controller/auditLogStock.controller.js";

const router = express.Router();

router.get(
  "/audit-logs/stocks",
  AuditLogStockController.getStockAuditLogs
);

export default router;