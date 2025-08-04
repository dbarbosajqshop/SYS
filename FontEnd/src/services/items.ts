import { IPostItem, IPutItem } from "@/types/items";
import { api } from "./api";
import { AxiosError } from "axios";
import { uploadImage } from "./imageUpload";
export const getItems = async (
  page: number = 1,
  limit: number = 10,
  param?: string,
  search?: string
) => {
  try {
    const response = !param
      ? await api.get("/items", {
          params: {
            page: page,
            limit: limit,
          },
        })
      : await api.get("/items/search", {
          params: {
            page: page,
            limit: limit,
            [param]: search,
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

export const getItemsNcm = async (
  page: number = 1,
  limit: number = 10,
  param?: string,
  search?: string
) => {
  try {
    const response = await api.get("/items/ncm", {
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
    throw new Error("An unexpected error occurred");
  }
};

export const getItem = async (id: string) => {
  try {
    const response = await api.get(`/items/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const searchItems = async (sku: string) => {
  try {
    const response = await api.get("/items/search", {
      params: {
        sku: sku,
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

export const postItem = async (data: IPostItem) => {
  try {
    const response = await api.post("/items", data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putItem = async (id: string, data: IPutItem) => {
  try {
    const response = await api.put(`/items/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putItemNcm = async (id: string, ncm: string) => {
  try {
    const response = await api.put(`/items/ncm/${id}`, { ncm });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteItem = async (id: string) => {
  try {
    const response = await api.delete(`/items/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putItemPhoto = async (id: string, photo: File) => {
  try {
    const downloadURL = await uploadImage("items", id, photo);

    const response = await api.put(`/items/photo/${id}`, { url: downloadURL });

    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getItemsSold = async (
  page: number = 1,
  limit: number = 10,
  param?: string,
  search?: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await api.get("/items/sold", {
      params: {
        page,
        limit,
        ...(param ? { [param]: search } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      },
    });

    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) return error.response;

    throw new Error("An unexpected error occurred");
  }
};

export const getItemSoldPerSeller = async (
  itemId: string,
  page: number = 1,
  limit: number = 10,
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await api.get(`/items/sold/${itemId}`, {
      params: {
        page,
        limit,
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      },
    });

    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) return error.response;

    throw new Error("An unexpected error occurred");
  }
};

export const getItemsCost = async (
  page: number = 1,
  limit: number = 10,
  param?: string,
  search?: string,
  startDate?: string,
  endDate?: string
) => {
  try {
    const response = await api.get("/items/cost", {
      params: {
        page,
        limit,
        ...(param ? { [param]: search } : {}),
        ...(startDate ? { startDate } : {}),
        ...(endDate ? { endDate } : {}),
      },
    });

    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) return error.response;

    throw new Error("An unexpected error occurred");
  }
};
