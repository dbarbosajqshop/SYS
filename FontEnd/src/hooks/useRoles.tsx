import { getAllRoles, getRoles, putUserRoles } from "@/services/roles";
import { IRoleResponse, IGetRole } from "@/types/roles";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

type Props = {
  page?: number;
  limit?: number;
  search?: string;
};

export const useRoles = () => {
  const [roles, setRoles] = useState<IRoleResponse>();
  const [rolesList, setRolesList] = useState<IGetRole[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRoles = async ({ page, limit, search }: Props = {}) => {
    try {
      setLoading(true);
      const response = await getRoles(page, limit, search);
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
        setRoles({
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

      setRoles(response.data);
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

  const listRoles = async () => {
    try {
      setLoading(true);
      const response = await getAllRoles();
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      setRolesList(response.data);
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

  const updateUserRoles = async (userId: string, roles: string[]) => {
    try {
      setLoading(true);
      const response = await putUserRoles(userId, roles);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      toast.success("Cargos atualizados com sucesso", { theme: "colored" });
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
    fetchRoles();
    listRoles();
  }, []);

  return {
    roles,
    rolesList,
    loading,
    fetchRoles,
    listRoles,
    updateUserRoles,
  };
};
