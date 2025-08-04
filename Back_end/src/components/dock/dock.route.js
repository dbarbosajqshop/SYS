import express from "express";
import paginable from "../../middlewares/paginable.manipulator.js";
import DockController from "./dock.controller.js";
import { authorize } from "../../middlewares/permissions.manipulator.js";

const dockRoute = express.Router();

dockRoute
  .get("/docks", authorize("r_dock"), DockController.getAll, paginable)
  .get("/docks/list", authorize("r_dock"), DockController.getAllList)
  .get("/docks/:id", authorize("r_dock"), DockController.getById)
  .post("/docks", authorize("w_dock"), DockController.create)
  .put("/docks/:id", authorize("u_dock"), DockController.update)
  .put("/docks/reative/:id", authorize("d_dock"), DockController.reative)
  .delete("/docks/:id", authorize("d_dock"), DockController.inative);

export default dockRoute;
