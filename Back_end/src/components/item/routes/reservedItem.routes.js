import express from "express";
import paginable from "../../../middlewares/paginable.manipulator.js";
import ReservedItemController from "../reservedItem.controller.js";

const reservedItemRoute = express.Router();

reservedItemRoute
  .get("/reserved-items", ReservedItemController.getAllReserved)
  .delete("/reserved-items", ReservedItemController.deleteAllReserved);

export default reservedItemRoute;
