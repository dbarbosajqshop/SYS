import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteCategory,
  getAllCategories,
  getCategories,
  getCategory,
  postCategory,
  putCategory,
} from "@/services/categories";
import { ICategoryResponse, IGetCategory, IPostCategory } from "@/types/categories";

type Props = {
  page?: number;
  limit?: number;
  param?: string;
  search?: string;
};

export const useCategories = () => {
  const [categories, setCategories] = useState<ICategoryResponse>();
  const [categoriesList, setCategoriesList] = useState<IGetCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCategories = async ({ page, limit, search }: Props = {}) => {
    try {
      setLoading(true);
      const response = await getCategories(page, limit, search);
      if (response.status === 401) {
        toast.error("Você não tem permissão para acessar essa página");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        toast.error(response.data.message || response.data.error);
        return;
      }

      if (response.status === 404) {
        setCategories({
          data: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 0,
          limit: 0,
        });
        toast.error(response.data.message);
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error);
        return;
      }

      setCategories(response.data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const listCategories = async () => {
    try {
      setLoading(true);
      const response = await getAllCategories();
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error);
        return;
      }
      setCategoriesList(response.data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (data: IPostCategory) => {
    try {
      setLoading(true);
      const response = await postCategory(data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error);
        return;
      }
      await fetchCategories();
      toast.success("Categoria criada com sucesso!");
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async (id: string, data: IPostCategory) => {
    try {
      setLoading(true);
      const response = await putCategory(id, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error);
        return;
      }
      await fetchCategories();
      toast.success("Categoria atualizada com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  const fetchCategory = async (id: string) => {
    try {
      setLoading(true);
      const response = await getCategory(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error);
        return;
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const removeCategory = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteCategory(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error);
        return;
      }
      await fetchCategories();
      toast.success("Categoria excluída com sucesso!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    listCategories();
  }, []);

  return {
    categories,
    categoriesList,
    loading,
    fetchCategories,
    listCategories,
    addCategory,
    updateCategory,
    removeCategory,
    fetchCategory,
  };
};
