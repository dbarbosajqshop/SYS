import { api } from "./api";
import { ICategoryAuditMetrics } from "../types/metrics"; 

interface ICategoryMetricsParams {
  userId?: string;
  targetId?: string;
  action?: string;
  search?: string;
  [key: string]: string | undefined;
}

export async function getCategoryAuditMetrics(params?: ICategoryMetricsParams): Promise<ICategoryAuditMetrics> {
  try {
    const response = await api.get<ICategoryAuditMetrics>("/audit-logs/category/metrics", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas de auditoria de categorias com filtros:", error);
    return {
      totalCategoryLogs: 0,
      newCategoryCreatesMonth: 0,
      updatedCategoriesLastWeek: 0,
      activatedCategoriesMonth: 0,
    };
  }
}