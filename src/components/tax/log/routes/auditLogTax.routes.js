import express from "express";
import AuditLogTaxController from "../controller/auditLogTax.controller.js";

const router = express.Router();

router.get("/audit-logs/tax", AuditLogTaxController.getAllLogs);

export default router;