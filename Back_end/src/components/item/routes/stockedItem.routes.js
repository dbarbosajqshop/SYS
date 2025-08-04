import express from "express";
import StockedItemController from "../stockedItem.controller.js";
import paginable from "../../../middlewares/paginable.manipulator.js";
import { authorize } from "../../../middlewares/permissions.manipulator.js";

const stockedItemRoute = express.Router();

stockedItemRoute
  .get(
    "/stocked-items",
    authorize("r_stocked_item"),
    StockedItemController.seeAllItems,
    paginable
  )
  .post(
    "/stocked-items/purchase/:purchaseId",
    authorize("w_stocked_item"),
    StockedItemController.stockNewPurchase
  )
  .put(
    "/stocked-items/:id",
    authorize("u_stocked_item"),
    StockedItemController.stockAnItemInALocation
  )
  .put(
    "/stocked-items/:id/quantity",
    authorize("u_stocked_items_quantity"),
    StockedItemController.updateQuantity
  )
  .put(
    "/stocked-items/:id/transfer",
    authorize("u_stocked_item"),
    StockedItemController.updateLocal
  );

export default stockedItemRoute;
