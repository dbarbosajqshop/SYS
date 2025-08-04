import { AxiosError, AxiosResponse } from "axios";
import { api } from "./api";
import {
  IAuditLogUserResponse, IFetchUserLogsParams,
  IAuditLogItemResponse, IFetchItemLogsParams,
  IAuditLogItemMovementResponse, IFetchItemMovementLogsParams,
  IAuditLogCategoryResponse, IFetchCategoryLogsParams,
  IAuditLogClientResponse, IFetchClientLogsParams,
  IAuditLogDockResponse, IFetchDockLogsParams,
  IAuditLogOrderResponse, IFetchOrderLogsParams,
  IAuditLogStockResponse, IFetchStockLogsParams,
  IAuditLogTaxResponse, IFetchTaxLogsParams,
  IAuditLogStockedItemResponse, IFetchStockedItemLogsParams, 
} from "@/types/auditLogs";
import { IStockedItemAuditMetrics } from "@/types/metrics"; 

export const getUserAuditLogs = async ({
  page = 1, limit = 10, action, userId, targetId, search, param,
}: IFetchUserLogsParams): Promise<IAuditLogUserResponse | AxiosResponse> => {
  try {
    const params: { [key: string]: string | number | undefined } = { page, limit };
    if (param && param !== "") {
      params[param] = search;
    } else {
      params.search = search;
    }
    if (action) params.action = action;
    if (userId) params.userId = userId;
    if (targetId) params.targetId = targetId;

    const response = await api.get("/audit-logs/user", { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) { return error.response; }
    throw new Error("An unexpected error occurred while fetching user audit logs.");
  }
};

export const getItemAuditLogs = async ({
  page = 1, limit = 10, action, userId, targetId, search, param,
}: IFetchItemLogsParams): Promise<IAuditLogItemResponse | AxiosResponse> => {
  try {
    const params: { [key: string]: string | number | undefined } = { page, limit };
    if (param && param !== "") {
      params[param] = search;
    } else {
      params.search = search;
    }
    if (action) params.action = action;
    if (userId) params.userId = userId;
    if (targetId) params.targetId = targetId;

    const response = await api.get("/audit-logs/item", { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) { return error.response; }
    throw new Error("An unexpected error occurred while fetching item audit logs.");
  }
};

export const getItemMovementAuditLogs = async ({
  page = 1, limit = 10, userId, itemId, action, fromLocationId, toLocationId, startDate, endDate, search, param,
}: IFetchItemMovementLogsParams): Promise<IAuditLogItemMovementResponse | AxiosResponse> => {
  try {
    const params: { [key: string]: string | number | undefined } = { page, limit };
    if (param && param !== "") {
        params[param] = search;
    } else {
      params.search = search;
    }
    if (userId) params.userId = userId;
    if (itemId) params.itemId = itemId;
    if (action) params.action = action;
    if (fromLocationId) params.fromLocationId = fromLocationId;
    if (toLocationId) params.toLocationId = toLocationId;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await api.get("/audit-logs/item-movement", { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) { return error.response; }
    throw new Error("An unexpected error occurred while fetching item movement audit logs.");
  }
};

export const getCategoryAuditLogs = async ({
  page = 1, limit = 10, action, userId, targetId, search, param,
}: IFetchCategoryLogsParams): Promise<IAuditLogCategoryResponse | AxiosResponse> => {
  try {
    const params: { [key: string]: string | number | undefined } = { page, limit };
    if (param && param !== "") {
      params[param] = search;
    } else {
      params.search = search;
    }
    if (action) params.action = action;
    if (userId) params.userId = userId;
    if (targetId) params.targetId = targetId;

    const response = await api.get("/audit-logs/category", { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) { return error.response; }
    throw new Error("An unexpected error occurred while fetching category audit logs.");
  }
};

export const getClientAuditLogs = async ({
  page = 1, limit = 10, action, userId, targetId, search, param,
}: IFetchClientLogsParams): Promise<IAuditLogClientResponse | AxiosResponse> => {
  try {
    const params: { [key: string]: string | number | undefined } = { page, limit };
    if (param && param !== "") {
      params[param] = search;
    } else {
      params.search = search;
    }
    if (action) params.action = action;
    if (userId) params.userId = userId;
    if (targetId) params.targetId = targetId;

    const response = await api.get("/audit-logs/clients", { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) { return error.response; }
    throw new Error("An unexpected error occurred while fetching client audit logs.");
  }
};

export const getDockAuditLogs = async ({
  page = 1, limit = 10, action, userId, targetId, search, param,
}: IFetchDockLogsParams): Promise<IAuditLogDockResponse | AxiosResponse> => {
  try {
    const params: { [key: string]: string | number | undefined } = { page, limit };
    if (param && param !== "") {
      params[param] = search;
    } else {
      params.search = search;
    }
    if (action) params.action = action;
    if (userId) params.userId = userId;
    if (targetId) params.targetId = targetId;

    const response = await api.get("/audit-logs/dock", { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) { return error.response; }
    throw new Error("An unexpected error occurred while fetching dock audit logs.");
  }
};

export const getOrderAuditLogs = async ({
  page = 1, limit = 10, action, userId, targetId, clientId, status, search, param,
}: IFetchOrderLogsParams): Promise<IAuditLogOrderResponse | AxiosResponse> => {
  try {
    const params: { [key: string]: string | number | undefined } = { page, limit };
    if (param && param !== "") {
      params[param] = search;
    } else {
      params.search = search;
    }
    if (action) params.action = action;
    if (userId) params.userId = userId;
    if (targetId) params.targetId = targetId;
    if (clientId) params.clientId = clientId;
    if (status) params.status = status;

    const response = await api.get("/audit-logs/order", { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) { return error.response; }
    throw new Error("An unexpected error occurred while fetching order audit logs.");
  }
};

// Nova função para buscar logs de itens estocados
export const getStockedItemAuditLogs = async ({
  page = 1, limit = 10, action, userId, stockedItemId, itemId, search, param,
}: IFetchStockedItemLogsParams): Promise<IAuditLogStockedItemResponse | AxiosResponse> => {
  try {
    const params: { [key: string]: string | number | undefined } = { page, limit };
    if (param && param !== "") {
      params[param] = search;
    } else {
      params.search = search;
    }
    if (action) params.action = action;
    if (userId) params.userId = userId;
    if (stockedItemId) params.stockedItemId = stockedItemId;
    if (itemId) params.itemId = itemId;

    const response = await api.get("/audit-logs/stocked-item", { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) { return error.response; }
    throw new Error("An unexpected error occurred while fetching stocked item audit logs.");
  }
};

// Nova função para buscar métricas de itens estocados
export const getStockedItemAuditMetrics = async (
  params: IFetchStockedItemLogsParams = {}
): Promise<IStockedItemAuditMetrics | AxiosResponse> => {
  try {
    const response = await api.get<IStockedItemAuditMetrics>("/audit-logs/stocked-item/metrics", { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) { return error.response; }
    throw new Error("An unexpected error occurred while fetching stocked item audit metrics.");
  }
};


export const getStockAuditLogs = async ({
  page = 1, limit = 10, action, userId, targetId, hierarchyLevel, includeHierarchy, search, param,
}: IFetchStockLogsParams): Promise<IAuditLogStockResponse | AxiosResponse> => {
  try {
    const params: { [key: string]: string | number | boolean | undefined } = { page, limit };
    if (param && param !== "") {
      params[param] = search;
    } else {
      params.search = search;
    }
    if (action) params.action = action;
    if (userId) params.userId = userId;
    if (targetId) params.targetId = targetId;
    if (hierarchyLevel) params.hierarchyLevel = hierarchyLevel;
    if (includeHierarchy !== undefined) params.includeHierarchy = includeHierarchy;

    const response = await api.get("/audit-logs/stocks", { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) { return error.response; }
    throw new Error("An unexpected error occurred while fetching stock audit logs.");
  }
};

export const getTaxAuditLogs = async ({
  page = 1, limit = 10, action, userId, targetId, search, param,
}: IFetchTaxLogsParams): Promise<IAuditLogTaxResponse | AxiosResponse> => {
  try {
    const params: { [key: string]: string | number | undefined } = { page, limit };
    if (param && param !== "") {
      params[param] = search;
    } else {
      params.search = search;
    }

    if (action) params.action = action;
    if (userId) params.userId = userId;
    if (targetId) params.targetId = targetId;

    const response = await api.get("/audit-logs/tax", { params });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) { return error.response; }
    throw new Error("An unexpected error occurred while fetching tax audit logs.");
  }
};
