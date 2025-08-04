import { api } from "./api";
import { IStockedItemAuditMetrics } from "../types/metrics";
import { IFetchStockedItemLogsParams } from "../types/auditLogs";
import { AxiosError } from "axios";

export async function getStockedItemAuditMetrics(
  params?: IFetchStockedItemLogsParams
): Promise<IStockedItemAuditMetrics> {
  try {
    const response = await api.get<IStockedItemAuditMetrics>("/audit-logs/stocked-item/metrics", { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar métricas de auditoria de itens estocados com filtros:", error);
    if (error instanceof AxiosError && error.response) {
      return {
        totalStockedItemLogs: 0,
        newStockedItemCreatesMonth: 0,
        updatedStockedItemsLastWeek: 0,
        totalStockedItemsInactivated: 0,
        totalStockedItemsReactivated: 0,
      };
    }
    throw new Error("An unexpected error occurred while fetching stocked item audit metrics.");
  }
}
