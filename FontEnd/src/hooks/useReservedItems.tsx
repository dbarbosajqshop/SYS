import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import {
  getStockedItemsOverview, 
} from "@/services/stockedItems"; 
import {
  IStockedItemOverviewResponse 
} from "@/types/stockedItems"; 
type Props = {
  page?: number;
  limit?: number;
  param?: string;
  search?: string;
};

interface IApiErrorResponse {
  message?: string;
  error?: string;
}

export const useReservedItems = () => { 
  const [reservedItems, setReservedItems] = useState<IStockedItemOverviewResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReservedItems = useCallback(async ({ page, limit, param, search }: Props = {}) => {
    try {
      setLoading(true);
      const response: AxiosResponse<IStockedItemOverviewResponse | IApiErrorResponse> = await getStockedItemsOverview(page, limit, param, search);

      if (response.status === 401) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Erro de autenticação.", { theme: "colored" });
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Acesso negado.", { theme: "colored" });
        return;
      }

      if (response.status === 404) {
        setReservedItems({
          data: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 0,
          limit: 0,
        });
        const errorData = response.data as IApiErrorResponse;
        toast.info(errorData.message || "Nenhum item reservado encontrado.", { theme: "colored" });
        return;
      }

      if (response.status !== 200) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Um erro inesperado ocorreu ao buscar itens reservados.", { theme: "colored" });
        return;
      }

      setReservedItems(response.data as IStockedItemOverviewResponse);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("Ocorreu um erro desconhecido ao buscar itens reservados.", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchReservedItems(); 
  }, [fetchReservedItems]);

  return {
    reservedItems, 
    loading,
    fetchReservedItems,
  };
};