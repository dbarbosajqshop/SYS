import { AxiosError } from "axios";
import { api } from "./api";
import { IPostDock } from "@/types/docks";

export const getDocks = async (
  page: number = 1,
  limit: number = 10,
  name?: string
) => {
  try {
    const response = await api.get("/docks", {
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

export const getAllDocks = async () => {
  try {
    const response = await api.get("/Docks/list");
    console.log(response);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postDock = async (data: IPostDock) => {
  try {
    const response = await api.post("/Docks", data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
export const putDock = async (id: string, data: IPostDock) => {
  try {
    const response = await api.put(`/Docks/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
export const deleteDock = async (id: string) => {
  try {
    const response = await api.delete(`/Docks/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
export const getDock = async (id: string) => {
  try {
    const response = await api.get(`/Docks/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
