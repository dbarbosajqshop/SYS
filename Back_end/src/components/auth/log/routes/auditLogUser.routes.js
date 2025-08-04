import express, { Router } from "express";
import AuditLogUserController from "../controller/auditLogUser.controller.js";
import { authorize } from '../../../../middlewares/permissions.manipulator.js';

const router = express.Router();

router.get("/audit-logs/user", AuditLogUserController.getAllLogs);

export default router;