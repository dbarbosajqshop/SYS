import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteStock, getStock, getStocks, postStock, putStock } from "@/services/stocks";
import { IPostStock, IPutStock, IStockResponse } from "@/types/stock";

export const useStocks = () => {
  const [stocks, setStocks] = useState<IStockResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStocks = async (page?: number, limit?: number) => {
    try {
      setLoading(true);
      const response = await getStocks(page, limit);

      if (response.status === 401) {
        toast.error("Você não tem permissão para acessar essa página", {
          theme: "colored",
        });
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }

      if (response.status === 404) {
        setStocks({
          data: [],
          totals: {
            totalStreets: 0,
            totalBuilds: 0,
            totalFloors: 0,
            totalStockedItems: 0,
          },
          totalItems: 0,
          totalPages: 0,
          currentPage: 0,
          limit: 0,
        });
        toast.error(response.data.message, { theme: "colored" });
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }

      setStocks(response.data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchStock = async (id: string) => {
    try {
      setLoading(true);
      const response = await getStock(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  };

  const addStock = async (data: IPostStock) => {
    try {
      setLoading(true);
      const response = await postStock(data);
      if (response.status !== 200) {
        toast.error(response.data.message, { theme: "colored" });
        return;
      }
      await fetchStocks();
      toast.success("Estoque criado com sucesso!", { theme: "colored" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("Algo deu errado ao criar o estoque", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id: string, data: IPutStock) => {
    try {
      setLoading(true);
      const response = await putStock(id, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchStocks();
      toast.success("Estoque atualizado com sucesso!", { theme: "colored" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeStock = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteStock(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchStocks();
      toast.success("Estoque excluído com sucesso!", { theme: "colored" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  return { stocks, loading, fetchStocks, fetchStock, addStock, updateStock, removeStock };
};
