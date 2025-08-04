import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteBuild, getBuild, getBuilds, postBuild, putBuild } from "@/services/builds";
import { IPostBuild, IPutBuild, IBuildResponse } from "@/types/build";

export const useBuilds = () => {
  const [builds, setBuilds] = useState<IBuildResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBuilds = async (page?: number, limit?: number, name?: string) => {
    try {
      setLoading(true);
      const response = await getBuilds(page, limit, name);

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
        setBuilds({ data: [], totalItems: 0, totalPages: 0, currentPage: 0, limit: 0 });
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }

      setBuilds(response.data);
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

  const fetchBuild = async (id: string) => {
    try {
      setLoading(true);
      const response = await getBuild(id);
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

  const addBuild = async (stockId: string, data: IPostBuild) => {
    try {
      setLoading(true);
      const response = await postBuild(stockId, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchBuilds();
      toast.success("Prédio criado com sucesso!", { theme: "colored" });
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

  const updateBuild = async (id: string, data: IPutBuild) => {
    try {
      setLoading(true);
      const response = await putBuild(id, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchBuilds();
      toast.success("Prédio atualizado com sucesso!", { theme: "colored" });
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

  const removeBuild = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteBuild(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchBuilds();
      toast.success("Prédio excluído com sucesso!", { theme: "colored" });
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
    fetchBuilds();
  }, []);

  return {
    builds,
    loading,
    fetchBuilds,
    fetchBuild,
    addBuild,
    updateBuild,
    removeBuild,
  };
};
