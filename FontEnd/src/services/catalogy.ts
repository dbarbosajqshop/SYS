import { ICatalogyResponse, IGetCatalogy } from "@/types/catalogy";
import { api } from "./api";
import { AxiosError } from "axios";

export const getCatalogy = async (page = 1, limit = 10, search = "") => {
  const { data } = await api.get<ICatalogyResponse>("/catalogy", {
    params: {
      page,
      limit,
      item: search,
    },
  });
  return data;
};

export const searchCatalogy = async ({
  search,
  page,
  orderLocal,
}: {
  search?: string;
  page?: number;
  orderLocal: "online" | "presencial";
}) => {
  try {
    const response = await api.get("/catalogy", {
      params: {
        item: search,
        page: page || 1,
        limit: 30,
        orderLocal,
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

export const getCatalogyById = async (id: string): Promise<IGetCatalogy> => {
  try {
    const { data } = await api.get<IGetCatalogy>(`/catalogy/${id}`);
    return data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error(error.message);
    }
    throw new Error("An unexpected error occurred");
  }
};
