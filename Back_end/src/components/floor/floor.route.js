import express from 'express'
import FloorController from './floor.controller.js';
import paginable from '../../middlewares/paginable.manipulator.js';
import { authorize } from '../../middlewares/permissions.manipulator.js';

const floorRoute = express.Router();

floorRoute
  .get('/floors', authorize('r_floor'), FloorController.getAll, paginable)
  .get('/floors/:id', authorize('r_floor'), FloorController.getById)
  .get('/floors/local/:localCode', authorize('r_floor'), FloorController.getLocal)
  .post('/floors/:BuildId', authorize('w_floor'), FloorController.create)
  .put('/floors/:id', authorize('u_floor'), FloorController.update)
  .put('/floors/reative/:id', authorize('u_floor'), FloorController.reative)
  .delete('/floors/:id', authorize('d_floor'), FloorController.inative)

export default floorRoute;