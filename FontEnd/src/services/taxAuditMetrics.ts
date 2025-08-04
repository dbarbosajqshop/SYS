import { api } from "./api";
import { ITaxAuditMetrics } from "../types/metrics"; 

interface ITaxMetricsParams {
  userId?: string;
  targetId?: string;
  action?: string;
  search?: string;
  [key: string]: string | undefined;
}

export async function getTaxAuditMetrics(params?: ITaxMetricsParams): Promise<ITaxAuditMetrics> {
  try {
    const response = await api.get<ITaxAuditMetrics>("/audit-logs/tax/metrics", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas de auditoria de taxas com filtros:", error);
    return {
      totalTaxLogs: 0,
      newTaxCreatesMonth: 0,
      updatedTaxesLastWeek: 0,
      taxesSelectedMonth: 0,
    };
  }
}