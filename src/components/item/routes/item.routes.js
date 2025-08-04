import express from "express";
import ItemController from "../item.controller.js";
import paginable from "../../../middlewares/paginable.manipulator.js";
import { authorize } from "../../../middlewares/permissions.manipulator.js";

const itemRoute = express.Router();



itemRoute
  .get(
    "/items/search",
    authorize("r_items"),
    ItemController.getItem,
    paginable
  )
  .get(
    "/items/ncm",
    authorize("r_items"),
    ItemController.getItemNcm,
    paginable
  )
  .get(
    "/items",
    authorize("r_items"),
    ItemController.getAll,
    paginable
  )
  .get(
    "/items/:id",
    authorize("r_items"),
    ItemController.getById
  )
  .get(
    "/items/photo/:id",
    authorize("r_items"),
    ItemController.findPhotoById
  )
  .post(
    "/items",
    authorize("w_items"),
    ItemController.create
  )
  .put(
    "/items/:id",
    authorize("u_items"),
    ItemController.update
  )
  .put(
    "/items/ncm/:id",
    authorize("u_items"),
    ItemController.updateNcm
  )
  .put(
    "/items/photo/:id",
    authorize("u_items"),
    ItemController.savePhoto
  )
  .put(
    "/items/reative/:id",
    authorize("u_items"),
    ItemController.reative
  )
  .delete(
    "/items/:id",
    authorize("d_items"),
    ItemController.inative
  );

export default itemRoute;
