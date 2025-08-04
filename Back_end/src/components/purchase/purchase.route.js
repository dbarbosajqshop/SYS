import express from "express";
import PurchaseController from "./purchase.controller.js";
import paginable from "../../middlewares/paginable.manipulator.js";
import { authorize } from "../../middlewares/permissions.manipulator.js";

const purchaseRoute = express.Router();

purchaseRoute
  .get(
    "/purchases",
    authorize("r_purchase"),
    PurchaseController.getAll,
    paginable
  )
  .get("/purchases/:id", authorize("r_purchase"), PurchaseController.getById)
  .post("/purchases/:id/item", PurchaseController.getBySkuOrCode)
  .post("/purchases", authorize("w_purchase"), PurchaseController.create)
  .put("/purchases/:id", authorize("u_purchase"), PurchaseController.update)
  .put(
    "/purchases/reative/:id",
    authorize("u_purchase"),
    PurchaseController.reative
  )
  .delete(
    "/purchases/:id",
    authorize("d_purchase"),
    PurchaseController.inative
  );

export default purchaseRoute;
