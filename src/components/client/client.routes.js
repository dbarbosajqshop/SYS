import express from 'express'
import ClientController from './client.controller.js';
import paginable from '../../middlewares/paginable.manipulator.js';
import { authorize } from '../../middlewares/permissions.manipulator.js'

const clientRoute = express.Router();

clientRoute
  .get('/clients', authorize("r_client"), ClientController.getAll, paginable)
  .get('/clients/:id', authorize("r_client"), ClientController.getById)
  .post('/clients', authorize("w_client"), ClientController.create)
  .put('/clients/:id', authorize("u_client"), ClientController.update)
  .put('/clients/:id/add-voucher', authorize("w_client"), authorize('u_client_voucher'), ClientController.addVoucherAtClient)
  .put('/clients/reative/:id', authorize("d_client"), ClientController.reative)
  .delete('/clients/:id', authorize("d_client"), ClientController.delete)

export default clientRoute;
