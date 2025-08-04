import { IPostFloor, IPutFloor } from "@/types/floor";
import { api } from "./api";
import { AxiosError } from "axios";

export const getFloors = async (page: number = 1, limit: number = 10, name?: string) => {
  try {
    const response = await api.get("/floors", {
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

export const getFloor = async (id: string) => {
  try {
    const response = await api.get(`/floors/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postFloor = async (stockId: string, data: IPostFloor) => {
  try {
    const response = await api.post(`/floors/${stockId}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putFloor = async (id: string, data: IPutFloor) => {
  try {
    const response = await api.put(`/floors/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteFloor = async (id: string) => {
  try {
    const response = await api.delete(`/floors/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getByLocal = async (local: string) => {
  try {
    const response = await api.get(`/floors/local/${local}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
}
