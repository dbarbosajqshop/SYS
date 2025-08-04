import express from 'express'
import CashierController from '../controller/cashier.controller.js'
import paginable from '../../../middlewares/paginable.manipulator.js';

const cashierRoutes = express.Router();

cashierRoutes
  .get('/cashiers', CashierController.getCashier, paginable)
  .get('/cashiers/user', CashierController.getMyCashier)
  .get('/cashiers/:id', CashierController.getCashierById)
  .get('/cashiers/:id/export-pdf', CashierController.exportPdf)
  .post('/cashiers', CashierController.openCashier)
  .put('/cashiers/:id/add-cash', CashierController.addCashAtCashierForced)
  .delete('/cashiers', CashierController.closeCashier)

export default cashierRoutes;
