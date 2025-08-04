import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  deleteOrder,
  deliverOrder,
  getOrder,
  getOrders,
  postOrder,
  putOrder,
  addDock,
} from "@/services/orders";
import { IPostOrder, IGetOrder } from "@/types/orders";
import useLoadingStore from "@/store/loadingStore";
import { useProfile } from "./useProfile";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";

type OrderStatus =
  | "pendente"
  | "separacao"
  | "conferencia"
  | "docas"
  | "transito"
  | "entregue"
  | "em pagamento"
  | "all";

const OrderStatusPermissions = {
  pendente: "d_pending_orders",
  separacao: "d_separation_orders",
  conferencia: "d_conference_orders",
  docas: "d_docks_orders",
  entregue: "d_delivered_orders",
  "em pagamento": "d_payments_order",
};

type OrdersParams = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  param?: string;
  search?: string;
};

export const useOrders = (orderStatus: OrderStatus) => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setIsLoading } = useLoadingStore();
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState("");

  const [dSearch] = useDebounce(search, 500);

  const { authorize } = useProfile();

  const fetchOrders = async ({
    page,
    limit,
    status,
    param,
    search,
  }: OrdersParams = {}) => {
    try {
      setLoading(true);
      const response = await getOrders({ page, limit, status, param, search });

      if (response.status === 401) {
        toast.error(response.data.message || response.data.error, {
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
        toast.error(response.data.message, { theme: "colored" });
        return {
          data: [],
          totalOrders: 0,
          totalPages: 0,
          currentPage: 0,
          limit: 0,
        };
      }

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

  const fetchOrder = async (id: string) => {
    try {
      setLoading(true);
      const response = await getOrder(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      return response.data as IGetOrder;
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

  const addOrder = async (data: IPostOrder) => {
    try {
      setLoading(true);
      const response = await postOrder(data);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      refetchOrders();
      toast.success("Order criado com sucesso!");
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

  const { data: orders, refetch: refetchOrders } = useQuery({
    queryKey: ["orders", orderStatus, page, dSearch, selectedFilter],
    queryFn: () =>
      fetchOrders({
        search,
        page,
        param: selectedFilter,
        status: orderStatus,
      }),
    enabled: !!orderStatus,
  });

  const updateOrder = async (id: string, { ReceiptPayments, ...data }: IGetOrder) => {
    try {
      setLoading(true);
      const formatedItems = data?.Items?.map((item) => ({
        ItemId: item.ItemId._id,
        quantity: item.quantity,
      }));

      const response = await putOrder(id, {
        payments: ReceiptPayments,
        ...data,
        Items: formatedItems,
      });
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      refetchOrders();
      toast.success("Order atualizado com sucesso!");
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

  const removeOrder = async (id: string) => {
    try {
      setLoading(true);
      const response = await deleteOrder(id);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      refetchOrders();
      toast.success("Pedido excluído com sucesso!", { theme: "colored" });
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

  const handleDeliverOrder = async (id: string) => {
    setIsLoading(true);
    const response = await deliverOrder(id);

    setIsLoading(false);

    if (response) {
      toast.success("Pedido Entregue com sucesso!", { theme: "colored" });
      refetchOrders();
      setTimeout(() => {
        navigate("/dashboard/docks");
      }, 2000);
    }
  };

  const addDockToOrder = async (id: string, dock: string) => {
    try {
      setLoading(true);
      const response = await addDock(id, dock);
      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }
      refetchOrders();
      toast.success("Doca adicionada ao pedido com sucesso!", {
        theme: "colored",
      });
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

  const handlePageClick = (page: number) => {
    setPage(page);
  };

  return {
    orders,
    loading,
    fetchOrders,
    fetchOrder,
    addOrder,
    updateOrder,
    removeOrder: authorize(
      OrderStatusPermissions?.[orderStatus as keyof typeof OrderStatusPermissions]
    )
      ? removeOrder
      : undefined,
    handleDeliverOrder,
    addDockToOrder,
    handlePageClick,
    states: {
      search,
      setSearch,
      page,
      setPage,
      selectedFilter,
      setSelectedFilter,
    },
  };
};
