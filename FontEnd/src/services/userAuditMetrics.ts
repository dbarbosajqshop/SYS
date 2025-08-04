import { api } from "./api";
import { IUserAuditMetrics } from "../types/metrics"; 

interface IUserMetricsParams {
  action?: string;
  userId?: string;
  targetId?: string;
  targetType?: string;
  search?: string;
  [key: string]: string | undefined; 
}

export async function getUserAuditMetrics(params?: IUserMetricsParams): Promise<IUserAuditMetrics> {
  try {
    const response = await api.get<IUserAuditMetrics>("/audit-logs/user/metrics", { params }); 
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas de auditoria de usuários com filtros:", error);
    return {
      totalUserLogs: 0,
      newUsersLoggedMonth: 0,
      updatedUsersLastWeek: 0,
      logsByUserTarget: 0,
      logsByRoleTarget: 0,
      logsByPermissionTarget: 0,
    };
  }
}