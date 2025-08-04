import { api } from "./api";
import { IDockAuditMetrics } from "../types/metrics"; 

interface IDockMetricsParams {
  userId?: string;
  targetId?: string;
  action?: string;
  search?: string;
  [key: string]: string | undefined;
}

export async function getDockAuditMetrics(params?: IDockMetricsParams): Promise<IDockAuditMetrics> {
  try {
    const response = await api.get<IDockAuditMetrics>("/audit-logs/dock/metrics", { params }); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas de auditoria de docas com filtros:", error);
    return {
      totalDockLogs: 0,
      newDockCreatesMonth: 0,
      updatedDocksLastWeek: 0,
      activatedDocksMonth: 0,
    };
  }
}