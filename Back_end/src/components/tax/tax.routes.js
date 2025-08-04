import express from 'express';
import TaxController from './tax.controller.js';
import paginable from '../../middlewares/paginable.manipulator.js';
import { authorize } from '../../middlewares/permissions.manipulator.js';

const taxRoute = express.Router();

taxRoute
  .get('/taxes', authorize("r_tax"), TaxController.getAll, paginable)
  .get('/taxes/selected', TaxController.getSelected)
  .get('/taxes/:id', authorize("r_tax"), TaxController.getById)
  .post('/taxes', authorize("w_tax"), TaxController.create)
  .put('/taxes/:id', authorize("u_tax"), TaxController.updateTax)
  .put('/taxes/reative/:id', authorize("d_tax"), TaxController.reative)
  .delete('/taxes/:id', authorize("d_tax"), TaxController.delete)

export default taxRoute;
