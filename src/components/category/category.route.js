import express from "express";
import paginable from "../../middlewares/paginable.manipulator.js";
import { authorize } from "../../middlewares/permissions.manipulator.js";
import CategoryController from "./category.controller.js";

const categoryRoute = express.Router();

categoryRoute
  .get("/categories", authorize("r_category"), CategoryController.getAll, paginable)
  .get("/categories/list", authorize("r_category"), CategoryController.getAllList)
  .get("/categories/:id", authorize("r_category"), CategoryController.getById)
  .post("/categories", authorize("w_category"), CategoryController.create)
  .put("/categories/:id", authorize("u_category"), CategoryController.update)
  .put("/categories/reative/:id", authorize("d_category"), CategoryController.reative)
  .delete("/categories/:id", authorize("d_category"), CategoryController.inative);

export default categoryRoute;
