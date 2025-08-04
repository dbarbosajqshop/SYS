import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import {
  deleteStockedItem,
  getStockedItem,
  getStockedItems, 
  postStockedItem,
  putStockedItem,
  putNewLocal,
  putTransferItem,
  putUpdateQuantity,
  getStockedItemLocationsByItemId,
  IStockedLocation,
} from "@/services/stockedItems";
import {
  IPostStockedItem,
  IPutStockedItem,
  ITransferStockedItem,
  IGetStockedItem,
  IStockedItemResponse, 
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

export const useStockedItems = () => { 
  const [stockedItems, setStockedItems] = useState<IStockedItemResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStockedItemsData = useCallback(async ({ page, limit, param, search }: Props = {}) => {
    try {
      setLoading(true);
      const response: AxiosResponse<IStockedItemResponse | IApiErrorResponse> = await getStockedItems(page, limit, param, search);

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
        setStockedItems({
          data: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 0,
          limit: 0,
        });
        const errorData = response.data as IApiErrorResponse;
        toast.info(errorData.message || "Nenhum item estocado encontrado.", { theme: "colored" }); 
        return;
      }

      if (response.status !== 200) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Um erro inesperado ocorreu ao buscar itens estocados.", { theme: "colored" });
        return;
      }

      setStockedItems(response.data as IStockedItemResponse);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("Ocorreu um erro desconhecido ao buscar itens estocados.", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const fetchStockedItem = useCallback(async (id: string): Promise<IGetStockedItem | undefined> => {
    try {
      setLoading(true);
      const response: AxiosResponse<IGetStockedItem | IApiErrorResponse> = await getStockedItem(id);

      if (response.status !== 200) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Erro ao buscar item estocado.", { theme: "colored" });
        return undefined;
      }
      return response.data as IGetStockedItem;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
      return undefined;
    } finally {
      setLoading(false);
    }
  }, []);

  const addStockedItem = useCallback(async (data: IPostStockedItem): Promise<AxiosResponse<IGetStockedItem> | undefined> => {
    try {
      setLoading(true);
      const response: AxiosResponse<IGetStockedItem | IApiErrorResponse> = await postStockedItem(data);

      if (response.status !== 200) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Erro ao adicionar compra.", { theme: "colored" });
        return undefined;
      }
      await fetchStockedItemsData(); 
      return response as AxiosResponse<IGetStockedItem>;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [fetchStockedItemsData]);

  const updateStockedItem = useCallback(async (id: string, data: IPutStockedItem): Promise<void> => {
    try {
      setLoading(true);
      const response: AxiosResponse<IGetStockedItem | IApiErrorResponse> = await putStockedItem(id, data);

      if (response.status !== 200) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Erro ao atualizar compra.", { theme: "colored" });
        return;
      }
      await fetchStockedItemsData(); 
      toast.success("Compra atualizada com sucesso!", { theme: "colored" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  }, [fetchStockedItemsData]);

  const removeStockedItem = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true);
      const response: AxiosResponse<{ message: string } | IApiErrorResponse> = await deleteStockedItem(id);

      if (response.status !== 200) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Erro ao excluir compra.", { theme: "colored" });
        return;
      }
      await fetchStockedItemsData(); 
      toast.success("Compra excluída com sucesso!", { theme: "colored" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  }, [fetchStockedItemsData]);

  const newLocal = useCallback(async (id: string, data: ITransferStockedItem): Promise<void> => {
    try {
      setLoading(true);
      const response: AxiosResponse<IGetStockedItem | IApiErrorResponse> = await putNewLocal(id, data);

      if (response.status !== 200) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Erro ao transferir item.", { theme: "colored" });
        return;
      }
      await fetchStockedItemsData(); 
      toast.success("Item transferido para novo local!", { theme: "colored" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  }, [fetchStockedItemsData]);

  const transferItem = useCallback(async (id: string, data: ITransferStockedItem): Promise<void> => {
    try {
      setLoading(true);
      const response: AxiosResponse<IGetStockedItem | IApiErrorResponse> = await putTransferItem(id, data);

      if (response.status !== 200) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Erro ao transferir item.", { theme: "colored" });
        return;
      }
      await fetchStockedItemsData(); 
      toast.success("Item transferido com sucesso!", { theme: "colored" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  }, [fetchStockedItemsData]);

  const updateQuantity = useCallback(async (id: string, newQuantity: number): Promise<void> => {
    try {
      setLoading(true);
      const response: AxiosResponse<IGetStockedItem | IApiErrorResponse> = await putUpdateQuantity(id, newQuantity);

      if (response.status !== 200) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Erro ao atualizar quantidade.", { theme: "colored" });
        return;
      }
      await fetchStockedItemsData(); 
      toast.success("Quantidade atualizada com sucesso!", { theme: "colored" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  }, [fetchStockedItemsData]);

  const fetchStockedLocationsByItemId = useCallback(async (itemId: string, type: string): Promise<IStockedLocation[]> => {
    try {
      setLoading(true);
      const response: AxiosResponse<IStockedLocation[] | IApiErrorResponse> = await getStockedItemLocationsByItemId(itemId, type);

      if (response.status === 404) {
        const errorData = response.data as IApiErrorResponse;
        toast.info(errorData.message || "Nenhum estoque encontrado para este item e tipo.", { theme: "colored" });
        return [];
      }
      if (response.status !== 200) {
        const errorData = response.data as IApiErrorResponse;
        toast.error(errorData.message || errorData.error || "Erro ao buscar locais de estoque.", { theme: "colored" });
        return [];
      }
      return response.data as IStockedLocation[];
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("Ocorreu um erro desconhecido ao buscar locais de estoque.", { theme: "colored" });
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStockedItemsData(); 
  }, [fetchStockedItemsData]);

  return {
    stockedItems,
    loading,
    fetchStockedItems: fetchStockedItemsData,
    fetchStockedItem,
    addStockedItem,
    updateStockedItem,
    removeStockedItem,
    newLocal,
    transferItem,
    updateQuantity,
    fetchStockedLocationsByItemId,
  };
};