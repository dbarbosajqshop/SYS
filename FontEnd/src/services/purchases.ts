import { IPostPurchase, IPutPurchase } from "@/types/purchases";
import { api } from "./api";
import { AxiosError } from "axios";

export const getPurchases = async (page: number = 1, limit: number = 10, name?: string) => {
  try {
    const response = await api.get("/purchases", {
      params: {
        page: page,
        limit: limit,
        name: name,
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

export const getPurchase = async (id: string) => {
  try {
    const response = await api.get(`/purchases/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postPurchase = async (data: IPostPurchase) => {
  try {
    const response = await api.post("/purchases", data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putPurchase = async (id: string, data: IPutPurchase) => {
  try {
    const response = await api.put(`/purchases/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deletePurchase = async (id: string) => {
  try {
    const response = await api.delete(`/purchases/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const checkItems = async (id: string, item: { sku: string; boxQuantity: number }) => {
  try {
    const response = await api.post(`/purchases/${id}/item`, item);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
