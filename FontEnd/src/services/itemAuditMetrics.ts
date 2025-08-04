import { api } from "./api";
import { IItemAuditMetrics } from "../types/metrics";

interface IItemMetricsParams {
  userId?: string;
  targetId?: string;
  action?: string;
  search?: string;
  targetType?: string;
  [key: string]: string | undefined;
}

export async function getItemAuditMetrics(params?: IItemMetricsParams): Promise<IItemAuditMetrics> {
  try {
    const response = await api.get<IItemAuditMetrics>("/audit-logs/item/metrics", { params }); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas de auditoria de itens com filtros:", error);
    return {
      totalItemLogs: 0,
      newItemCreatesMonth: 0,
      updatedItemsLastWeek: 0,
      logsByItemTarget: 0,
      logsByItemCategoryTarget: 0,
      logsByItemPhotoTarget: 0,
    };
  }
}