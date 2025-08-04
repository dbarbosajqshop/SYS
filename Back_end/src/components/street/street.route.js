import express from 'express'
import StreetController from './street.controller.js';
import paginable from '../../middlewares/paginable.manipulator.js';
import { authorize } from '../../middlewares/permissions.manipulator.js';

const streetRoute = express.Router();

streetRoute
  .get('/streets', authorize('r_street'), StreetController.getAll, paginable)
  .get('/streets/:id', authorize('r_street'), StreetController.getById)
  .post('/streets/:StockId', authorize('w_street'), StreetController.create)
  .put('/streets/:id', authorize('u_street'), StreetController.update)
  .put('/streets/reative/:id', authorize('u_street'), StreetController.reative)
  .delete('/streets/:id', authorize('d_street'), StreetController.inative)

export default streetRoute;