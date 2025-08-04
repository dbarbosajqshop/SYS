import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteItem,
  getItem,
  getItems,
  postItem,
  putItem,
  putItemPhoto,
} from "@/services/items";
import { IPostItem, IPutItem, IItemResponse } from "@/types/items";

type Props = {
  page?: number;
  limit?: number;
  param?: string;
  search?: string;
};

export const useItems = () => {
  const [items, setItems] = useState<IItemResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchItems = async ({ page, limit, param, search }: Props = {}) => {
    try {
      setLoading(true);
      const response = await getItems(page, limit, param, search);

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
        setItems({ data: [], totalItems: 0, totalPages: 0, currentPage: 0, limit: 0 });
        toast.error(response.data.message, { theme: "colored" });
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }

      setItems(response.data);
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

  const fetchItem = async (id: string) => {
    try {
      setLoading(true);
      const response = await getItem(id);
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

  const addItem = async (data: IPostItem) => {
    try {
      setLoading(true);
      const response = await postItem(data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchItems();
      toast.success("Item criado com sucesso!", { theme: "colored" });
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

  const updateItem = async (id: string, data: IPutItem) => {
    try {
      setLoading(true);
      const response = await putItem(id, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchItems();
      toast.success("Item atualizado com sucesso!", { theme: "colored" });
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

  const removeItem = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteItem(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchItems();
      toast.success("Item excluído com sucesso!", { theme: "colored" });
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

  const savePhoto = async (id: string, file: File) => {
    try {
      setLoading(true);
      const response = await putItemPhoto(id, file);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      toast.success("Imagem salva com sucesso!", { theme: "colored" });
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
    fetchItems();
  }, []);

  return {
    items,
    loading,
    fetchItems,
    fetchItem,
    addItem,
    updateItem,
    removeItem,
    savePhoto,
  };
};
