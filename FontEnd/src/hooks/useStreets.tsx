import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteStreet,
  getStreet,
  getStreets,
  postStreet,
  putStreet,
} from "@/services/streets";
import { IPostStreet, IPutStreet, IStreetResponse } from "@/types/street";

export const useStreets = () => {
  const [streets, setStreets] = useState<IStreetResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStreets = async (page?: number, limit?: number, name?: string) => {
    try {
      setLoading(true);
      const response = await getStreets(page, limit, name);

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
        setStreets({ data: [], totalItems: 0, totalPages: 0, currentPage: 0, limit: 0 });
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }

      setStreets(response.data);
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

  const fetchStreet = async (id: string) => {
    try {
      setLoading(true);
      const response = await getStreet(id);
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

  const addStreet = async (stockId: string, data: IPostStreet) => {
    try {
      setLoading(true);
      const response = await postStreet(stockId, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchStreets();
      toast.success("Rua criada com sucesso!", { theme: "colored" });
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

  const updateStreet = async (id: string, data: IPutStreet) => {
    try {
      setLoading(true);
      const response = await putStreet(id, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchStreets();
      toast.success("Rua atualizado com sucesso!", { theme: "colored" });
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

  const removeStreet = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteStreet(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchStreets();
      toast.success("Rua excluída com sucesso!", { theme: "colored" });
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
    fetchStreets();
  }, []);

  return {
    streets,
    loading,
    fetchStreets,
    fetchStreet,
    addStreet,
    updateStreet,
    removeStreet,
  };
};
