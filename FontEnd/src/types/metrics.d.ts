export interface IClientAuditMetrics {
  totalClientLogs: number;
  newClientsLoggedMonth: number;
  updatedClientsLastWeek: number;
  totalClientCreates: number;
  totalClientUpdates: number;
  totalClientDeletes: number;
}

export interface IUserAuditMetrics {
  totalUserLogs: number;
  newUsersLoggedMonth: number;
  updatedUsersLastWeek: number;
  logsByUserTarget: number;
  logsByRoleTarget: number;
  logsByPermissionTarget: number;
}

export interface IItemAuditMetrics {
  totalItemLogs: number;
  newItemCreatesMonth: number;
  updatedItemsLastWeek: number;
  logsByItemTarget: number;
  logsByItemCategoryTarget: number;
  logsByItemPhotoTarget: number;
}

export interface IItemMovementAuditMetrics {
  totalMovementLogs: number;
  totalInboundQuantityLastMonth: number;
  totalOutboundQuantityLastMonth: number;
  totalTransfersMonth: number;
  totalAdjustmentsQuantity: number;
}

export interface ICategoryAuditMetrics {
  totalCategoryLogs: number;
  newCategoryCreatesMonth: number;
  updatedCategoriesLastWeek: number;
  activatedCategoriesMonth: number;
}

export interface IDockAuditMetrics {
  totalDockLogs: number;
  newDockCreatesMonth: number;
  updatedDocksLastWeek: number;
  activatedDocksMonth: number;
}

export interface IOrderAuditMetrics {
  totalOrderLogs: number;
  newOrderCreatesMonth: number;
  updatedOrdersLastWeek: number;
  totalValueLastMonth: number;
  pendingOrdersCount: number;
  deliveredOrdersCount: number;
}

export interface IStockedItemAuditMetrics {
  totalStockedItemLogs: number;
  newStockedItemCreatesMonth: number;
  updatedStockedItemsLastWeek: number;
  totalStockedItemsInactivated: number;
  totalStockedItemsReactivated: number;
}

export interface IStockAuditMetrics {
  totalStockLogs: number;
  newHierarchyCreatesMonth: number;
  updatedHierarchyLastWeek: number;
  totalHierarchyInactivations: number;
  inactivatedStocks: number;
  inactivatedStreets: number;
  inactivatedBuilds: number;
  inactivatedFloors: number;
  totalActiveStocks: number;
  reactivatedStocksMonth: number
}

export interface ITaxAuditMetrics {
  totalTaxLogs: number;
  newTaxCreatesMonth: number;
  updatedTaxesLastWeek: number;
  taxesSelectedMonth: number;
}

interface ITaxMetricsParams {
  userId?: string;
  targetId?: string;
  action?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: string | undefined;
}