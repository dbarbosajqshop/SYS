import express from "express";
import paginable from "../../middlewares/paginable.manipulator.js";
import OrderController from "./order.controller.js";
import { authorizeDynamic } from "../../middlewares/dinamicPermissions.manipulator.js";
import { mapStatusToPermission } from "../../utils/permissions.js";
import Order from "./schema/order.schema.js";
import multer from "multer";
import { authorize } from "../../middlewares/permissions.manipulator.js";

const storage = multer.memoryStorage();
const upload = multer({ storage });

const orderRoute = express.Router();

orderRoute
  .get("/orders/:id/tax-coupon-pdf", OrderController.exportTaxCouponToPdf)
  .get(
    "/orders",
    authorizeDynamic(async (req) => {
      const { status } = req.query;
      return mapStatusToPermission(status);
    }),
    OrderController.getAllOrders,
    paginable
  )
  .get("/orders/most-sold", OrderController.mostSoldItems)
  .get(
    "/orders/:id",
    authorizeDynamic(async (req) => {
      const { id } = req.params;
      const order = await Order.findById(id).select("status");
      return mapStatusToPermission(order?.status);
    }),
    OrderController.getById
  )
  .post("/orders/get-balance", OrderController.getBalance)
  .put("/orders/:id/items", OrderController.separateOrder)

  .put("/orders/:id/adjust-pending", OrderController.adjustPending)
  .put("/orders/:id/confirm-pending", OrderController.confirmPending)
  .put("/orders/:id/check-save", OrderController.saveCheck)
  .put("/orders/:id/check", OrderController.checkOrder)
  .put("/orders/:id/save", OrderController.saveSeparate)
  .put("/orders/:id/deliver", OrderController.deliverOrder)
  .put("/orders/:id/proof-payment", OrderController.saveProofOfPayment)
  .put("/orders/:id/check-order-payments", OrderController.checkPaymentOrder)

  .put("/orders/:id/reative", OrderController.reativeOrder)
  .put("/orders/:id", OrderController.updateOrder)
  .put("/orders/:id/dock", OrderController.addDockToOrder)
  .delete("/orders/:id/", authorize("d_order"), OrderController.deleteOrder);
//order = r_my_order
//order = w_order
//order = u_order
//order = d_order

export default orderRoute;
