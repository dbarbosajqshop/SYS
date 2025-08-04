import express from "express";
import DashboardController from "./dashboard.controller.js";

const dashboardRoute = express.Router();

dashboardRoute
  .get("/dashboards/register", DashboardController.getRegister)
  .get("/dashboards/orders", DashboardController.getOrders)
  .get("/dashboards/stocks", DashboardController.getStocks)
  .get("/dashboards/purchases", DashboardController.getPurchases);

export default dashboardRoute;
