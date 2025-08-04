import { api } from "./api";
import { IStockAuditMetrics } from "../types/metrics";

interface IStockMetricsParams {
  userId?: string;
  targetId?: string;
  action?: string;
  hierarchyLevel?: string;
  includeHierarchy?: boolean;
  search?: string;
  [key: string]: string | boolean | undefined;
}

export async function getStockAuditMetrics(params?: IStockMetricsParams): Promise<IStockAuditMetrics> {
  try {
    const response = await api.get<IStockAuditMetrics>("/audit-logs/stocks/metrics", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas de auditoria de estoque com filtros:", error);
    return {
      totalStockLogs: 0,
      newHierarchyCreatesMonth: 0,
      updatedHierarchyLastWeek: 0,
      totalHierarchyInactivations: 0,
      inactivatedStocks: 0,
      inactivatedStreets: 0,
      inactivatedBuilds: 0,
      inactivatedFloors: 0,
      totalActiveStocks: 0,
      reactivatedStocksMonth: 0,
    };
  }
}