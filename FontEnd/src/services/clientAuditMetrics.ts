import { api } from "./api"; 
import { IClientAuditMetrics } from "../types/metrics"; 

export async function getClientAuditMetrics(): Promise<IClientAuditMetrics> {
  try {

    const response = await api.get<IClientAuditMetrics>("/audit-logs/clients/metrics");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas de auditoria de clientes:", error);

    return {
      totalClientLogs: 0,
      newClientsLoggedMonth: 0,
      updatedClientsLastWeek: 0,
      totalClientCreates: 0,
      totalClientUpdates: 0,
      totalClientDeletes: 0,
    };
  }
}