import { useState, useEffect, useCallback } from "react"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteClient,
  getClient,
  getClients,
  postClient,
  putClient,
  addVoucher,
  getClientCount, 
} from "@/services/clients";
import { IPostClient, IPutClient, IClientResponse, IGetClient } from "@/types/client";

type Props = {
  page?: number;
  limit?: number;
  client?: string;
};

export const useClients = () => {
  const [clients, setClients] = useState<IClientResponse>();
  const [loading, setLoading] = useState(true);
  const [clientCount, setClientCount] = useState<number>(0); 
  const [loadingClientCount, setLoadingClientCount] = useState<boolean>(true); 
  const navigate = useNavigate();
  const fetchTotalClientCount = useCallback(async () => {
    setLoadingClientCount(true);
    try {
      const count = await getClientCount();
      setClientCount(count);
    } catch (error) {
      toast.error("Erro ao carregar a contagem de clientes.", { theme: "colored" });
      console.error("Erro ao buscar contagem de clientes:", error);
      setClientCount(0);
    } finally {
      setLoadingClientCount(false);
    }
  }, []); 

  const fetchClients = useCallback(async ({page, limit = 10, client}: Props = {}) => {
    try {
      setLoading(true);
      const response = await getClients(page, limit, client);

      if (response.status === 401) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        navigate("/login");
        return undefined;
      }

      if (response.status === 403) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }

      setClients(response.data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("Ocorreu um erro desconhecido", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]); 

  const fetchClient = async (id: string) => {
    try {
      setLoading(true);
      const response = await getClient(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("Ocorreu um erro desconhecido", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (data: IPostClient): Promise<IGetClient | undefined> => {
    try {
      setLoading(true);
      const response = await postClient(data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      await fetchClients();
      await fetchTotalClientCount(); 
      toast.success("Usuário criado com sucesso!", { theme: "colored" });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("Ocorreu um erro desconhecido", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateClient = async (id: string, data: IPutClient) => {
    try {
      setLoading(true);
      const response = await putClient(id, data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      await fetchClients(); 
      toast.success("Usuário atualizado com sucesso!", { theme: "colored" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("Ocorreu um erro desconhecido", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeClient = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteClient(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      await fetchClients();
      await fetchTotalClientCount(); 
      toast.success("Usuário excluído com sucesso!", { theme: "colored" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("Ocorreu um erro desconhecido", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  };

  const newVoucher = async (id: string, value: number) => {
    try {
      setLoading(true);
      const response = await addVoucher(id, value);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, { theme: "colored" });
        return;
      }
      await fetchClients(); 
      toast.success("Voucher adicionado com sucesso!", { theme: "colored" });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("Ocorreu um erro desconhecido", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    fetchTotalClientCount(); 
  }, [fetchClients, fetchTotalClientCount]); 

  return {
    clients,
    loading,
    clientCount,        
    loadingClientCount, 
    fetchClients,
    fetchClient,
    addClient,
    updateClient,
    removeClient,
    newVoucher,
  };
};