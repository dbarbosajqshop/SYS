import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteUser,
  getUser,
  getUsers,
  postUser,
  putUser,
  searchUsers,
} from "@/services/users";
import { IPostUser, IPutUser, IUserResponse } from "@/types/user";

export const useUsers = () => {
  const [users, setUsers] = useState<IUserResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUsers = async (page?: number, limit?: number) => {
    try {
      setLoading(true);
      const response = await getUsers(page, limit);

      if (response.status === 401) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });

        navigate("/login");
        return;
      }

      if (response.status === 403) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }

      setUsers(response.data);
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

  const search = async (name: string, page?: number, limit?: number) => {
    try {
      setLoading(true);
      const response = await searchUsers(page, limit, name);

      if (response.status === 401) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        toast.error("Sessão expirada, faça login novamente", {
          theme: "colored",
        });
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }

      setUsers(response.data);
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

  const fetchUser = async (id: string) => {
    try {
      setLoading(true);
      const response = await getUser(id);
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

  const addUser = async (data: IPostUser) => {
    try {
      setLoading(true);
      const response = await postUser(data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchUsers();
      toast.success("Usuário criado com sucesso!", { theme: "colored" });
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

  const updateUser = async (id: string, data: IPutUser) => {
    try {
      setLoading(true);
      const response = await putUser(id, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchUsers();
      toast.success("Usuário atualizado com sucesso!", { theme: "colored" });
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

  const removeUser = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteUser(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      await fetchUsers();
      toast.success("Usuário excluído com sucesso!", { theme: "colored" });
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
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    fetchUsers,
    search,
    fetchUser,
    addUser,
    updateUser,
    removeUser,
  };
};
