import {
  deleteDock,
  getAllDocks,
  getDock,
  getDocks,
  postDock,
  putDock,
} from "@/services/docks";
import { IDockResponse, IGetDock, IPostDock } from "@/types/docks";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {
  page?: number;
  limit?: number;
  param?: string;
  search?: string;
};

export const useDocks = () => {
  const [docks, setDocks] = useState<IDockResponse>();
  const [docksList, setDocksList] = useState<IGetDock[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDocks = async ({ page, limit, search }: Props = {}) => {
    try {
      setLoading(true);
      const response = await getDocks(page, limit, search);
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
        setDocks({
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

      setDocks(response.data);
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

  const listDocks = async () => {
    try {
      setLoading(true);
      const response = await getAllDocks();
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      setDocksList(response.data);
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

  const addDock = async (data: IPostDock) => {
    try {
      setLoading(true);
      const response = await postDock(data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchDocks();
      toast.success("Doca criada com sucesso!", { theme: "colored" });
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

  const updateDock = async (id: string, data: IPostDock) => {
    try {
      setLoading(true);
      const response = await putDock(id, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchDocks();
      toast.success("Doca atualizada com sucesso!", { theme: "colored" });
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
  const fetchDock = async (id: string) => {
    try {
      setLoading(true);
      const response = await getDock(id);
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

  const removeDock = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteDock(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchDocks();
      toast.success("Doca excluída com sucesso!", { theme: "colored" });
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
    fetchDocks();
    listDocks();
  }, []);

  return {
    docks,
    docksList,
    loading,
    fetchDocks,
    listDocks,
    addDock,
    updateDock,
    removeDock,
    fetchDock,
  };
};
