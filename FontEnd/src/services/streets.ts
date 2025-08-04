import { IPostStreet, IPutStreet } from "@/types/street";
import { api } from "./api";
import { AxiosError } from "axios";

export const getStreets = async (page: number = 1, limit: number = 10, name?: string) => {
  try {
    const response = await api.get("/streets", {
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

export const getStreet = async (id: string) => {
  try {
    const response = await api.get(`/streets/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postStreet = async (stockId: string, data: IPostStreet) => {
  try {
    const response = await api.post(`/streets/${stockId}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putStreet = async (id: string, data: IPutStreet) => {
  try {
    const response = await api.put(`/streets/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteStreet = async (id: string) => {
  try {
    const response = await api.delete(`/streets/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
