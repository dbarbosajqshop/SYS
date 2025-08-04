import { IPostClient, IPutClient, IClientResponse } from "@/types/client";
import { api } from "./api";
import { AxiosError } from "axios";

export const getClients = async (
  page: number = 1,
  limit: number = 10,
  name?: string
) => {
  try {
    const response = await api.get<IClientResponse>("/clients", { 
      params: {
        page: page,
        limit: limit,
        client: name,
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

export const getClientCount = async () => {
  try {
    const response = await api.get<IClientResponse>("/clients", {
      params: {
        page: 1,
        limit: 1, 
      },
    });
    if (response.status === 200) {
      return response.data.totalItems; 
    }
    return 0; 
  } catch (error) {
    console.error("Erro ao buscar contagem de clientes:", error);
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw new Error("Ocorreu um erro inesperado ao buscar a contagem de clientes.");
  }
};


export const getClient = async (id: string) => {
  try {
    const response = await api.get(`/clients/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postClient = async (data: IPostClient) => {
  try {
    const response = await api.post("/clients", data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putClient = async (id: string, data: IPutClient) => {
  try {
    const response = await api.put(`/clients/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteClient = async (id: string) => {
  try {
    const response = await api.delete(`/clients/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const addVoucher = async (id: string, value: number) => {
  try {
    const response = await api.put(`/clients/${id}/add-voucher`, {
      voucher: { value },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};