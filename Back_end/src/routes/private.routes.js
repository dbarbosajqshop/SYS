import express from "express";
import userRoute from "../components/auth/routes/user.routes.js";
import stockRoute from "../components/stock/stock.route.js";
import streetRoute from "../components/street/street.route.js";
import buildRoute from "../components/build/build.route.js";
import floorRoute from "../components/floor/floor.route.js";
import itemRoute from "../components/item/routes/item.routes.js";
import stockedItemRoute from "../components/item/routes/stockedItem.routes.js";
import purchaseRoute from "../components/purchase/purchase.route.js";
import dashboardRoute from "../components/dashboards/dashboard.routes.js";
import clientRoute from "../components/client/client.routes.js";
import cartRoute from "../components/cart/cart.routes.js";
import roleRoute from "../components/auth/routes/role.routes.js";
import permissionRoute from "../components/auth/routes/permission.routes.js";
import orderRoute from "../components/order/order.routes.js";
import moneyAccountRoutes from "../components/moneyAccount/routes/moneyAccount.routes.js";
import cashierRoutes from "../components/cashier/routes/cashier.routes.js";
import paymentReceiptRoutes from "../components/payments/routes/paymentReceipt.routes.js";
import categoryRoute from "../components/category/category.route.js";
import dockRoute from "../components/dock/dock.route.js";
import taxRoute from "../components/tax/tax.routes.js";
import reservedItemRoute from "../components/item/routes/reservedItem.routes.js";
import auditLogClient from "../components/client/log/routes/auditLogClient.route.js";
import auditLogItem from "../components/item/log/routes/auditLogItem.routes.js";
import auditoLogUserRoute from "../components/auth/log/routes/auditLogUser.routes.js";
import auditLogStock from "../components/stock/log/routes/auditLogStock.route.js";
import auditLogCategory from "../components/category/log/routes/auditLogCategory.route.js";
import auditLogTax from "../components/tax/log/routes/auditLogTax.routes.js";
import auditLogDock from "../components/dock/log/routes/auditLogDock.route.js";


const privateRoute = (app) => {
  app.use(
    express.json(),
    userRoute,
    stockRoute,
    categoryRoute,
    dockRoute,
    streetRoute,
    buildRoute,
    floorRoute,
    itemRoute,
    stockedItemRoute,
    purchaseRoute,
    dashboardRoute,
    clientRoute,
    cartRoute,
    roleRoute,
    permissionRoute,
    orderRoute,
    moneyAccountRoutes,
    cashierRoutes,
    paymentReceiptRoutes,
    taxRoute,
    reservedItemRoute,
    auditLogClient,
    auditLogItem,
    auditoLogUserRoute,
    auditLogStock,
    auditLogCategory,
    auditLogTax,
    auditLogDock,
    
  );
};

export default privateRoute;
