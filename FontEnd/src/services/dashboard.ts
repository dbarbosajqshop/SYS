import {
  DashboardOrders,
  DashboardPurchases,
  DashboardRegister,
} from "@/types/dashboard";
import { api } from "./api";
import { TFilters } from "@/pages/report/useReportOrders";

const PATH_URL = "/dashboards";

export const getOrdersDashboard = async (filters?: TFilters, payments?: string[]) => {
  const { data } = await api.get<DashboardOrders>(`${PATH_URL}/orders`, {
    params: {
      ...filters,
      payments: payments?.join(','),
      sellerName: filters?.param === 'sellerName' ? filters?.search : undefined,
      clientName: filters?.param === 'clientName' ? filters?.search : undefined,
      local: filters?.param === 'local' ? filters?.search : undefined
    },
  });
  return data;
};
export const getRegisterDashboard = async () => {
  const { data } = await api.get<DashboardRegister>(`${PATH_URL}/register`);
  return data;
};
export const getStocksDashboard = async () => {
  const { data } = await api.get<DashboardRegister>(`${PATH_URL}/stocks`);
  return data;
};

export const getPurchasesDashboard = async () => {
  const { data } = await api.get<DashboardPurchases>(`${PATH_URL}/purchases`);
  return data;
};
