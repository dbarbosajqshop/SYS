import { IDailyReport, IMonthlyReport } from "@/types/reports";
import { api } from "./api";
import { AxiosError } from "axios";

export const getDailyReport = async ({
  month,
  year,
}: { month?: number; year?: number } = {}) => {
  try {
    const response = await api.get<IDailyReport>("/payment-receipts/daily-report", {
      params: {
        month: month,
        year: year,
      },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getMonthlyReport = async ({ year }: { year?: number } = {}) => {
  try {
    const response = await api.get<IMonthlyReport>("/payment-receipts/monthly-report", {
      params: {
        year: year,
      },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
