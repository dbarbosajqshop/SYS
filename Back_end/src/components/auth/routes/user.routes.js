import express from "express";
import UserController from "../user.controller.js";
import multer from "multer";
import paginable from "../../../middlewares/paginable.manipulator.js";
import { authorize } from '../../../middlewares/permissions.manipulator.js'

const userRoute = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

userRoute
  //permission = w_sp_password
  //permission = r_user_all
  .get('/users/sellers', UserController.getAllSellers)
  .get("/users/sp-password", UserController.getSupervisorPassword, paginable)
  .get("/users/all", UserController.getAll, paginable)
  .get("/users/photo/:id", UserController.findPhotoById)
  .get("/users/search", UserController.getUserByNameAndEmail, paginable)
  .get("/users", UserController.getAllActives, paginable)
  //permission = r_my_user
  .get("/users/:id", UserController.getById)
  //permission = w_user
  .post("/users", UserController.create)
  .post(
    "/users/validate-sp-password",
    UserController.validateSupervisorPassword
  )
  //permission = p_users
  .patch("/users/:id/sp-password", authorize('p_users_sp_password'), UserController.createSupervisorPassword)
  //permission = u_user
  .put("/users/password/:id", UserController.updatePassword)
  .put("/users/photo/:id", upload.single("image"), UserController.savePhoto)
  .put("/users/reative/:id", UserController.reativeUser)
  .put("/users/:id", UserController.updateUser)
  //permission = d_user
  .delete("/users/:id", UserController.inativeUser);

export default userRoute;
