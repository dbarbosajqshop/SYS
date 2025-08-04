import express from "express";
import { authorize } from "../../../middlewares/permissions.manipulator.js";
import PaymentReceiptController from "../controllers/paymetReceipt.controller.js";
import paginable from "../../../middlewares/paginable.manipulator.js";

const paymentReceiptRoutes = express.Router();

paymentReceiptRoutes
  .get('/payment-receipts', authorize('r_payments'), PaymentReceiptController.getAll, paginable)

export default paymentReceiptRoutes;