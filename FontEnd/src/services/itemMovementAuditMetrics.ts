import { api } from "./api";
import { IItemMovementAuditMetrics } from "../types/metrics"; 

interface IItemMovementMetricsParams {
  userId?: string;
  itemId?: string;
  action?: string;
  fromLocationId?: string;
  toLocationId?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  [key: string]: string | undefined;
}

export async function getItemMovementAuditMetrics(params?: IItemMovementMetricsParams): Promise<IItemMovementAuditMetrics> {
  try {
    const response = await api.get<IItemMovementAuditMetrics>("/audit-logs/item-movement/metrics", { params }); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas de auditoria de movimentação de itens com filtros:", error);
    return {
      totalMovementLogs: 0,
      totalInboundQuantityLastMonth: 0,
      totalOutboundQuantityLastMonth: 0,
      totalTransfersMonth: 0,
      totalAdjustmentsQuantity: 0,
    };
  }
}