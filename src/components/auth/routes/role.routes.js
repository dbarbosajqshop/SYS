import express from "express";
import RoleController from "../role.controller.js";
import paginable from "../../../middlewares/paginable.manipulator.js";

const roleRoute = express.Router();

roleRoute
  //permission = r_role_all
  .get("/roles", RoleController.getAll, paginable)
  .get("/roles/list", RoleController.listRoles)
  //permission = r_my_role
  //permission = w_role
  .post("/roles", RoleController.createRole)

  .post("/roles/config", RoleController.configurateRoles)

  //permission = u_role
  .put("/roles/permission", RoleController.addPermissionToRole)
  .put("/roles/users", RoleController.syncRoleAtUser)
  .put("/roles/users/multi", RoleController.syncRolesAtUser);
//permission = d_role

// .post("/roles/newRoles", RoleController.createRoles);

export default roleRoute;
