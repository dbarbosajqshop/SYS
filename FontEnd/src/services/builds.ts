import { IPostBuild, IPutBuild } from "@/types/build";
import { api } from "./api";
import { AxiosError } from "axios";

export const getBuilds = async (page: number = 1, limit: number = 10, name?: string) => {
  try {
    const response = await api.get("/builds", {
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

export const getBuild = async (id: string) => {
  try {
    const response = await api.get(`/builds/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postBuild = async (stockId: string, data: IPostBuild) => {
  try {
    const response = await api.post(`/builds/${stockId}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putBuild = async (id: string, data: IPutBuild) => {
  try {
    const response = await api.put(`/builds/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteBuild = async (id: string) => {
  try {
    const response = await api.delete(`/builds/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
