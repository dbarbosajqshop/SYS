import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { deleteTax, getTaxes, getTax, postTax, putTax } from "@/services/taxes";
import { ITaxResponse, IPostTax } from "@/types/taxes";

type Props = {
  page?: number;
  limit?: number;
  param?: string;
  search?: string;
};

export const useTaxes = () => {
  const [taxes, setTaxes] = useState<ITaxResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTaxes = async ({ page, limit, search }: Props = {}) => {
    try {
      setLoading(true);
      const response = await getTaxes(page, limit, search);
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
        setTaxes({
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
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }

      setTaxes(response.data);
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

  const addTax = async (data: IPostTax) => {
    try {
      setLoading(true);
      const response = await postTax(data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchTaxes();
      toast.success("Taxa criada com sucesso!", { theme: "colored" });
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

  const updateTax = async (id: string, data: IPostTax) => {
    try {
      setLoading(true);
      const response = await putTax(id, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchTaxes();
      toast.success("Taxa atualizada com sucesso!", { theme: "colored" });
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
  const fetchTax = async (id: string) => {
    try {
      setLoading(true);
      const response = await getTax(id);
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

  const removeTax = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteTax(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchTaxes();
      toast.success("Taxa excluída com sucesso!", {
        theme: "colored",
      });
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
    fetchTaxes();
  }, []);

  return {
    taxes,
    loading,
    fetchTaxes,
    addTax,
    updateTax,
    removeTax,
    fetchTax,
  };
};
