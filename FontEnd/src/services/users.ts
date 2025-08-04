import { IPostUser, IPutUser } from "@/types/user";
import { api } from "./api";
import { AxiosError } from "axios";

export const getUsers = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get("/users", {
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
    throw new Error("Ocorreu um erro inesperado.");
  }
};

export const getSellers = async (page: number = 1, limit: number = 10) => {
  try {
    const response = await api.get("/users/sellers", {
      params: {
        page: page,
        limit: limit,
      },
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw new Error("Ocorreu um erro inesperado ao buscar vendedores.");
  }
};

export const getSellersUnpaginated = async () => {
  try {
    const response = await api.get("/users/all-sellers");
    return response.data; 
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw new Error("Ocorreu um erro inesperado ao buscar todos os vendedores.");
  }
};

export const searchUsers = async (
  page: number = 1,
  limit: number = 10,
  search: string
) => {
  try {
    const response = await api.get("/users/search", {
      params: {
        page: page,
        limit: limit,
        name: search,
        email: search,
      },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("Ocorreu um erro inesperado.");
  }
};

export const getUser = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("Ocorreu um erro inesperado.");
  }
};

export const postUser = async (data: IPostUser) => {
  try {
    const response = await api.post("/users", data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("Ocorreu um erro inesperado.");
  }
};

export const putUser = async (id: string, data: IPutUser) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    return response;
  }
  catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("Ocorreu um erro inesperado.");
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("Ocorreu um erro inesperado.");
  }
};

export const changePassword = async (
  id: string,
  data: { actualPassword: string; password: string }
) => {
  try {
    const response = await api.put(`/users/password/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("Ocorreu um erro inesperado.");
  }
};

export const putUserPhoto = async (id: string, photo: File) => {
  try {
    const formData = new FormData();
    formData.append("image", photo);
    const response = await api.put(`/users/photo/${id}`, formData);
    console.log(response);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("Ocorreu um erro inesperado.");
  }
};

export const getNextSpPasswordStart = async () => {
  const { data } = await api.get(`/users/sp-password`);
  return data;
};

export const patchSpPassword = async (id: string, spPassword: string) => {
  const { data } = await api.patch(`/users/${id}/sp-password`, { spPassword });
  return data;
};

export const validateSpPassword = async (spPassword: string) => {
  return await api.post(`/users/validate-sp-password`, {
    password: spPassword,
  });
};