import { IPostStock, IPutStock } from "@/types/stock";
import { api } from "./api";
import { AxiosError } from "axios";

export const getStocks = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get("/stocks", {
      params: {
        page: page,
        limit: limit,
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

export const getStock = async (id: string) => {
  try {
    const response = await api.get(`/stocks/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postStock = async (data: IPostStock) => {
  try {
    const response = await api.post("/stocks", data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putStock = async (id: string, data: IPutStock) => {
  try {
    const response = await api.put(`/stocks/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteStock = async (id: string) => {
  try {
    const response = await api.delete(`/stocks/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
