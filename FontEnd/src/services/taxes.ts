import { AxiosError } from "axios";
import { api } from "./api";
import { IPostTax } from "@/types/taxes";

export const getTaxes = async (
  page: number = 1,
  limit: number = 10,
  name?: string
) => {
  try {
    const response = await api.get("/taxes", {
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

export const getTax = async (id: string) => {
  try {
    const response = await api.get(`/taxes/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getSelectedTax = async () => {
  try {
    const response = await api.get("/taxes/selected");
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postTax = async (data: IPostTax) => {
  try {
    const response = await api.post("/taxes", data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putTax = async (id: string, data: IPostTax) => {
  try {
    const response = await api.put(`/taxes/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteTax = async (id: string) => {
  try {
    const response = await api.delete(`/taxes/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

