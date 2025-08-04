import { api } from "./api";
import { AxiosError } from "axios";

export const getRoles = async (page?: number, limit?: number, search?: string) => {
  try {
    const response = await api.get("/roles", {
      params: {
        page,
        limit,
        search,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getAllRoles = async () => {
  try {
    const response = await api.get("/roles/list");
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putUserRoles = async (userId: string, roles: string[]) => {
  try {
    const response = await api.put("/roles/users/multi", {
      userId,
      roleIds: roles,
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};
