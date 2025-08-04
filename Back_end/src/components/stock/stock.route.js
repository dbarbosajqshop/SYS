import express from 'express'
import StockController from './stock.controller.js';
import paginable from '../../middlewares/paginable.manipulator.js';
import { authorize } from '../../middlewares/permissions.manipulator.js';

const stockRoute = express.Router();

stockRoute
  .get('/stocks', authorize('r_stock'), StockController.getAll, paginable)
  .get('/stocks/:id', authorize('r_stock'), StockController.getById)
  .post('/stocks', authorize('w_stock'), StockController.create)
  .put('/stocks/:id', authorize('u_stock'), StockController.update)
  .put('/stocks/reative/:id', authorize('u_stock'), StockController.reative)
  .delete('/stocks/:id', authorize('d_stock'), StockController.inative)

export default stockRoute;