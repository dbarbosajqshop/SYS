import express from "express";
import AuditLogClientController from "../controller/auditLogClient.controller.js";

const router = express.Router();

router.get(
  "/audit-logs/clients",
  AuditLogClientController.getClientAuditLogs
);

export default router;
