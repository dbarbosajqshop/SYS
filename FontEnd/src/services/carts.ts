import { IPostCart } from "@/types/carts";
import { api } from "./api";
import { AxiosError } from "axios";

export const createCart = async () => {
  try {
    const response = await api.post("/carts");
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const updateCart = async (cartId: string, data: IPostCart) => {
  try {
    const response = await api.put(`/carts/${cartId}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const sellOrder = async (cartId: string, data: IPostCart) => {
  try {
    const response = await api.put(`/carts/${cartId}/save`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const exportPdf = async (data: IPostCart) => {
  try {
    const response = await api.post(`/carts/export-pdf`, data, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const verifyCashier = async () => {
  try {
    const response = await api.get("/cashiers/user");
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const openCashier = async (cashInCashier: number) => {
  try {
    const response = await api.post("/cashiers", { cashInCashier });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const closeCashier = async () => {
  try {
    const response = await api.delete("/cashiers");
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
