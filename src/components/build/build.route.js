import express from 'express'
import BuildController from './build.controller.js';
import paginable from '../../middlewares/paginable.manipulator.js';
import { authorize } from '../../middlewares/permissions.manipulator.js';

const buildRoute = express.Router();

buildRoute
  .get('/builds', authorize('r_build'), BuildController.getAll, paginable)
  .get('/builds/:id', authorize('r_build'), BuildController.getById)
  .post('/builds/:StreetId', authorize('w_build'), BuildController.create)
  .put('/builds/:id', authorize('u_build'), BuildController.update)
  .put('/builds/reative/:id', authorize('u_build'), BuildController.reative)
  .delete('/builds/:id', authorize('d_build'), BuildController.inative)

export default buildRoute;