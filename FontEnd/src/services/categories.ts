import { AxiosError } from "axios";
import { api } from "./api";
import { IPostCategory } from "@/types/categories";

export const getCategories = async (
  page: number = 1,
  limit: number = 10,
  name?: string
) => {
  try {
    const response = await api.get("/categories", {
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

export const getAllCategories = async () => {
  try {
    const response = await api.get("/categories/list");
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postCategory = async (data: IPostCategory) => {
  try {
    const response = await api.post("/categories", data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
export const putCategory = async (id: string, data: IPostCategory) => {
  try {
    const response = await api.put(`/categories/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete(`/categories/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
export const getCategory = async (id: string) => {
  try {
    const response = await api.get(`/categories/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
