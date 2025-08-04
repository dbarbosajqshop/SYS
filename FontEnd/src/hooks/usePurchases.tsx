import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deletePurchase,
  getPurchase,
  getPurchases,
  postPurchase,
  putPurchase,
} from "@/services/purchases";
import { IPostPurchase, IPutPurchase, IPurchaseResponse } from "@/types/purchases";

export const usePurchases = () => {
  const [purchases, setPurchases] = useState<IPurchaseResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPurchases = async (page?: number, limit?: number, name?: string) => {
    try {
      setLoading(true);
      const response = await getPurchases(page, limit, name);

      if (response.status === 401) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });

        navigate("/login");
        return;
      }

      if (response.status === 403) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });

        return;
      }

      if (response.status === 404) {
        setPurchases({
          data: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 0,
          limit: 0,
        });
        toast.error(response.data.message, { theme: "colored" });
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }

      setPurchases(response.data);
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

  const fetchPurchase = async (id: string) => {
    try {
      setLoading(true);
      const response = await getPurchase(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
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

  const addPurchase = async (data: IPostPurchase) => {
    try {
      setLoading(true);
      const response = await postPurchase(data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchPurchases();
      return response;
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

  const updatePurchase = async (id: string, data: IPutPurchase) => {
    try {
      setLoading(true);
      const response = await putPurchase(id, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchPurchases();
      toast.success("Compra atualizada com sucesso!");
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

  const removePurchase = async (id: string) => {
    try {
      setLoading(true);
      const response = await deletePurchase(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchPurchases();
      toast.success("Compra excluída com sucesso!");
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
    fetchPurchases();
  }, []);

  return {
    purchases,
    loading,
    fetchPurchases,
    fetchPurchase,
    addPurchase,
    updatePurchase,
    removePurchase,
  };
};
