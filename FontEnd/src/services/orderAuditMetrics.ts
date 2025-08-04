import { api } from "./api";
import { IOrderAuditMetrics } from "../types/metrics"; 

interface IOrderMetricsParams {
  action?: string;
  userId?: string;
  targetId?: string;
  clientId?: string;
  status?: string;
  search?: string;
  param?: string; 
  startDate?: string;
  endDate?: string;
  [key: string]: string | undefined;
}

export async function getOrderAuditMetrics(params?: IOrderMetricsParams): Promise<IOrderAuditMetrics> {
  try {
    const response = await api.get<IOrderAuditMetrics>("/audit-logs/order/metrics", { params }); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas de auditoria de pedidos com filtros:", error);
    return {
      totalOrderLogs: 0,
      newOrderCreatesMonth: 0,
      updatedOrdersLastWeek: 0,
      totalValueLastMonth: 0,
      pendingOrdersCount: 0,
      deliveredOrdersCount: 0,
    };
  }
}