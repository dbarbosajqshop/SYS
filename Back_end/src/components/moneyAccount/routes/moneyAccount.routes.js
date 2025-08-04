import express from 'express';
import MoneyAccountController from '../controller/moneyAccount.controller.js';

const moneyAccountRoutes = express.Router();

moneyAccountRoutes
  .get('/money-account/:UserId', MoneyAccountController.getById)
  .post('/money-account/:UserId', MoneyAccountController.create)

export default moneyAccountRoutes;