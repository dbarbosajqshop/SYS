export interface IAuditLogChange {
  field: string;
  oldValue: unknown;
  newValue: unknown;
}

export interface IGetAuditLogUser {
  _id: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  targetId: {
    _id: string;
    name?: string;
    email?: string;
  } | string;
  targetType: "User" | "Role" | "Permission";
  targetName?: string;
  changes: IAuditLogChange[];
  timestamp: string;
  __v: number;
}

export interface IAuditLogUserResponse {
  data: IGetAuditLogUser[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IFetchUserLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
  targetId?: string;
  search?: string;
  param?: string;
}

export interface IGetAuditLogItem {
  _id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "INACTIVATE" | "REACTIVATE" | "UPDATE_PHOTO";
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  targetId: {
    _id: string;
    name: string;
  } | string;
  targetType: "Item" | "ItemCategory" | "ItemPhoto";
  targetName?: string;
  changes: IAuditLogChange[];
  timestamp: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAuditLogItemResponse {
  data: IGetAuditLogItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IFetchItemLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
  targetId?: string;
  search?: string;
  param?: string;
}

export interface IGetAuditLogItemMovement {
  _id: string;
  action: "ITEM_INBOUND" | "ITEM_OUTBOUND" | "ITEM_TRANSFER" | "ITEM_INITIAL_STOCK" | "ITEM_ADJUSTMENT";
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  itemId: {
    _id: string;
    name: string;
    sku: string;
  } | string;
  itemName: string;
  quantity: number;

  fromLocationId?: string;
  fromLocationModel?: "Stock" | "Street" | "Build" | "Floor" | "Purchase" | "Order";
  fromLocationName?: string;

  toLocationId?: string;
  toLocationModel?: "Stock" | "Street" | "Build" | "Floor" | "Purchase" | "Order";
  toLocationName?: string;

  purchaseId?: string;
  orderId?: string;
  targetType: string;
  changes: IAuditLogChange[];

  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAuditLogItemMovementResponse {
  data: IGetAuditLogItemMovement[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IFetchItemMovementLogsParams {
  page?: number;
  limit?: number;
  userId?: string;
  itemId?: string;
  action?: string;
  fromLocationId?: string;
  toLocationId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  param?: string;
}

export interface IGetAuditLogCategory {
  _id: string;
  action: "CREATE" | "UPDATE" | "INACTIVATE" | "REACTIVATE";
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  targetId: {
    _id: string;
    name: string;
  } | string;
  targetType: "Category";
  targetName?: string;
  changes: IAuditLogChange[];
  timestamp: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAuditLogCategoryResponse {
  data: IGetAuditLogCategory[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IFetchCategoryLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
  targetId?: string;
  search?: string;
  param?: string;
}

export interface IGetAuditLogClient {
  _id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "INACTIVATE" | "REACTIVATE" | "ADD_VOUCHER";
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  targetId: {
    _id: string;
    name: string;
  } | string;
  clientName: string;
  changes: IAuditLogChange[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAuditLogClientResponse {
  data: IGetAuditLogClient[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IFetchClientLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
  targetId?: string;
  search?: string;
  param?: string;
}

export interface IGetAuditLogDock {
  _id: string;
  action: "CREATE" | "UPDATE" | "INACTIVATE" | "REACTIVATE";
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  targetId: {
    _id: string;
    code: string;
  } | string;
  targetType: "Dock";
  targetName?: string;
  changes: IAuditLogChange[];
  timestamp: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAuditLogDockResponse {
  data: IGetAuditLogDock[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IFetchDockLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
  targetId?: string;
  search?: string;
  param?: string;
}

export interface IGetAuditLogOrder {
  _id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "PAYMENT_UPDATE" | "ITEM_UPDATE";
  userId: {
    _id: string;
    name: string;
    email: string;
  } | string;
  clientId?: {
    _id: string;
    name: string;
  } | string;
  targetId: {
    _id: string;
    orderNumber?: string;
  } | string;
  targetType: "Order";
  targetName?: string;
  changes: IAuditLogChange[];
  metadata?: {
    orderNumber?: string;
    totalValue?: number;
    itemsCount?: number;
    local?: "online" | "presencial";
  };
  status?: string;
  timestamp?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAuditLogOrderResponse {
  data: IGetAuditLogOrder[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IFetchOrderLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
  targetId?: string;
  clientId?: string;
  status?: string;
  search?: string;
  param?: string;
}

export interface IGetAuditLogStockedItem {
  _id: string;
  action:
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "INACTIVATE"
  | "REACTIVATE"
  | "TRANSFER_OUT" // Saída por transferência
  | "TRANSFER_IN_NEW" // Novo item criado por transferência
  | "TRANSFER_IN_INCREMENT" // Item existente incrementado por transferência
  | "STORE_IN_LOCATION" // Item inicialmente estocado em um local
  | "QUANTITY_INCREMENT" // Aumento de quantidade (geral, ex: consolidação)
  | "QUANTITY_DECREASE" // Diminuição de quantidade (geral, ex: saída)
  | "QUANTITY_ADJUSTMENT" // Ajuste manual de quantidade (genérico)
  | "QUANTITY_INCREASE" // Aumento manual de quantidade
  | "NO_QUANTITY_CHANGE" // Update, mas sem mudança na quantidade
  | "CONSOLIDATE_INACTIVATE" // Item inativado por consolidação
  | "CONSOLIDATE_UPDATE" // Item atualizado por consolidação (recebeu a quantidade)
  | "QUANTITY_DEPLETED"; // Quantidade do item estocado chegou a zero
  userId:
  | {
    _id: string;
    name?: string;
    email?: string;
  }
  | string;
  stockedItemId:
  | {
    _id: string;
    quantity?: number;
    type?: string;
    local?: string;
  }
  | string;
  itemId:
  | {
    _id: string;
    name?: string;
    sku?: string;
  }
  | string;
  itemName: string;
  quantity: number;
  type?: string;
  local?: string;
  floorId?:
  | {
    _id: string;
    localCode?: string;
    name?: string;
  }
  | string;
  changes: IAuditLogChange[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  targetType: "StockedItem" | "Item" | "ItemCategory" | "ItemPhoto";
}

export interface IAuditLogStockedItemResponse {
  data: IGetAuditLogStockedItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IFetchStockedItemLogsParams {
  page?: number;
  limit?: number;
  userId?: string;
  stockedItemId?: string;
  itemId?: string;
  action?: string;
  search?: string;
  param?: string;
}

export interface IGetAuditLogStock {
  _id: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "INACTIVATE" | "REACTIVATE" | "INACTIVATE_HIERARCHY";
  userId:
  | {
    _id: string;
    name: string;
    email: string;
  }
  | string;
  targetId:
  | {
    _id: string;
    name?: string;
    code?: string;
  }
  | string;
  targetModel: "Stock" | "Street" | "Build" | "Floor";
  stockName: string;
  targetName?: string;
  hierarchy?: {
    streetId?: { _id: string; name?: string; code?: string } | string;
    buildId?: { _id: string; name?: string; code?: string } | string;
    floorId?: { _id: string; name?: string; code?: string } | string;
  };
  hierarchyDetails?: {
    streets?: number;
    builds?: number;
    floors?: number;
  };
  changes: IAuditLogChange[];
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAuditLogStockResponse {
  data: IGetAuditLogStock[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IFetchStockLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
  targetId?: string;
  hierarchyLevel?: "STOCK" | "STREET" | "BUILD" | "FLOOR";
  includeHierarchy?: boolean;
  search?: string;
  param?: string;
}

export interface IGetAuditLogTax {
  _id: string;
  action: "CREATE" | "UPDATE" | "INACTIVATE" | "REACTIVATE" | "SELECT";
  userId:
  | {
    _id: string;
    name: string;
    email: string;
  }
  | string;
  targetId:
  | {
    _id: string;
    name: string;
  }
  | string;
  targetType: "Tax";
  targetName?: string;
  changes: IAuditLogChange[];
  timestamp: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAuditLogTaxResponse {
  data: IGetAuditLogTax[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface IFetchTaxLogsParams {
  page?: number;
  limit?: number;
  action?: string;
  userId?: string;
  targetId?: string;
  search?: string;
  param?: string;
}