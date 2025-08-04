import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { deleteFloor, getFloor, getFloors, postFloor, putFloor } from "@/services/floors";
import { IPostFloor, IPutFloor, IFloorResponse } from "@/types/floor";

export const useFloors = () => {
  const [floors, setFloors] = useState<IFloorResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFloors = async (page?: number, limit?: number, name?: string) => {
    try {
      setLoading(true);
      const response = await getFloors(page, limit, name);

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
        setFloors({ data: [], totalItems: 0, totalPages: 0, currentPage: 0, limit: 0 });
        toast.error(response.data.message, { theme: "colored" });
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }

      setFloors(response.data);
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

  const fetchFloor = async (id: string) => {
    try {
      setLoading(true);
      const response = await getFloor(id);
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

  const addFloor = async (stockId: string, data: IPostFloor) => {
    try {
      setLoading(true);
      const response = await postFloor(stockId, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchFloors();
      toast.success("Andar criado com sucesso!", { theme: "colored" });
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

  const updateFloor = async (id: string, data: IPutFloor) => {
    try {
      setLoading(true);
      const response = await putFloor(id, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchFloors();
      toast.success("Andar atualizado com sucesso!", { theme: "colored" });
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

  const removeFloor = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteFloor(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      fetchFloors();
      toast.success("Andar excluído com sucesso!", { theme: "colored" });
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
    fetchFloors();
  }, []);

  return {
    floors,
    loading,
    fetchFloors,
    fetchFloor,
    addFloor,
    updateFloor,
    removeFloor,
  };
};
