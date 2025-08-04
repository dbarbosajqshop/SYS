import express from 'express'
import CartController from './cart.controller.js';
import paginable from '../../middlewares/paginable.manipulator.js'

const cartRoute = express.Router();

cartRoute
  .get('/catalogy', CartController.showCatalogItems, paginable)
  .get('/catalogy/:id', CartController.showCatalogItemById)
  .get('/carts', CartController.getCartById)
  .post('/carts/export-pdf', CartController.exportCartToPDF)
  .post('/carts', CartController.createEmptyCart)
  .put('/carts/:id', CartController.updateCart)
  .put('/carts/:id/save', CartController.sellOrder)
  .delete('/carts', CartController.closeCart)

export default cartRoute;
