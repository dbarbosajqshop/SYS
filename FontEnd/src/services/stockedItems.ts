import { AxiosError, AxiosResponse } from "axios";
import {
  IPostStockedItem,
  IPutStockedItem,
  ITransferStockedItem,
  IStockedItemResponse,
  IGetStockedItem,
  IStockedItemOverviewResponse, 
} from "@/types/stockedItems"; 
import { api } from "./api";

export interface IStockedLocation {
  local: string;
  quantity: number;
}

interface IApiErrorResponse {
  message?: string;
  error?: string;
}

export const getStockedItems = async (
  page: number = 1,
  limit: number = 10,
  param?: string,
  search?: string
): Promise<AxiosResponse<IStockedItemResponse | IApiErrorResponse>> => {
  try {
    const response = await api.get<IStockedItemResponse>("/stocked-items", {
      params: {
        page: page,
        limit: limit,
        ...(param ? { [param]: search } : {}),
      },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};

export const getStockedItemsOverview = async (
  page: number = 1,
  limit: number = 10,
  param?: string,
  search?: string
): Promise<AxiosResponse<IStockedItemOverviewResponse | IApiErrorResponse>> => {
  try {
    const response = await api.get<IStockedItemOverviewResponse>("/stocked-items/overview", {
      params: {
        page: page,
        limit: limit,
        ...(param ? { [param]: search } : {}),
      },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};

export const getStockedItem = async (id: string): Promise<AxiosResponse<IGetStockedItem | IApiErrorResponse>> => {
  try {
    const response = await api.get<IGetStockedItem>(`/stocked-items/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};

export const postStockedItem = async (data: IPostStockedItem): Promise<AxiosResponse<IGetStockedItem | IApiErrorResponse>> => {
  try {
    const response = await api.post<IGetStockedItem>("/stocked-items", data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};

export const putStockedItem = async (id: string, data: IPutStockedItem): Promise<AxiosResponse<IGetStockedItem | IApiErrorResponse>> => {
  try {
    const response = await api.put<IGetStockedItem>(`/stocked-items/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};

export const deleteStockedItem = async (id: string): Promise<AxiosResponse<{ message: string } | IApiErrorResponse>> => {
  try {
    const response = await api.delete<{ message: string }>(`/stocked-items/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};

export const separateItems = async (
  id: string,
  item: { local: string; value: string; quantity: number; type: string }
): Promise<AxiosResponse<{ message: string; quantityAtOrder?: number; error?: string } | IApiErrorResponse>> => {
  try {
    const response = await api.post<{ message: string; quantityAtOrder?: number; error?: string }>(`/orders/${id}/separate`, item);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};


export const stockPurchase = async (id: string): Promise<AxiosResponse<IGetStockedItem[] | IApiErrorResponse>> => {
  try {
    const response = await api.post<IGetStockedItem[]>(`/stocked-items/purchase/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};

export const putNewLocal = async (id: string, data: ITransferStockedItem): Promise<AxiosResponse<IGetStockedItem | IApiErrorResponse>> => {
  try {
    const response = await api.put<IGetStockedItem>(`/stocked-items/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};

export const putTransferItem = async (id: string, data: ITransferStockedItem): Promise<AxiosResponse<IGetStockedItem | IApiErrorResponse>> => {
  try {
    const response = await api.put<IGetStockedItem>(`/stocked-items/${id}/transfer`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};

export const putUpdateQuantity = async (id: string, newQuantity: number): Promise<AxiosResponse<IGetStockedItem | IApiErrorResponse>> => {
  try {
    const response = await api.put<IGetStockedItem>(`/stocked-items/${id}/quantity`, { newQuantity });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};

export const getStockedItemLocationsByItemId = async (itemId: string, type?: string): Promise<AxiosResponse<IStockedLocation[] | IApiErrorResponse>> => {
  try {
    const response = await api.get<IStockedLocation[]>(`/stocked-items/locations-by-item/${itemId}`, {
      params: { type },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      data: { message: "An unexpected error occurred while fetching item locations.", error: (error as Error).message },
      status: 500,
      statusText: "Internal Server Error",
      headers: {},
      config: {},
    } as AxiosResponse<IApiErrorResponse>;
  }
};