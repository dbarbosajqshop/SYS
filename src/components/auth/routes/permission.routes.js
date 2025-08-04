import express from 'express'
import paginable from '../../../middlewares/paginable.manipulator.js';
import PermissionController from '../permission.controller.js';

const permissionRoute = express.Router();

permissionRoute
  //permission = r_permission_all 
  .get('/permissions', PermissionController.getAll, paginable)
  //permission = r_my_permission
  //permission = w_permission
  .post('/permissions', PermissionController.createPermission)
  //permission = u_permission
  //permission = d_permission


export default permissionRoute