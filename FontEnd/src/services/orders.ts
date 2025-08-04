import { TFilters } from "@/pages/report/useReportOrders";
import { IPostOrder, IPutOrder, MostSoldItemsResponse } from "../types/orders";
import { api } from "./api";
import { AxiosError } from "axios";
import { SellerPerformanceData, PaginatedCategorySalesResponse } from "@/types/performance"; 

type IChecked = {
  item: {
    _id: string;
    sku: string;
    name: string;
  };
  checkedQuantity: number;
  completed: boolean;
};

export const getOrders = async ({
  page = 1,
  limit = 10,
  status,
  param,
  search,
}: {
  page?: number;
  limit?: number;
  status?: string;
  param?: string;
  search?: string;
}) => {
  try {
    const response = await api.get("/orders", {
      params: {
        page: page,
        limit: limit,
        status: status,
        ...(param ? { [param]: search } : {}),
      },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getOrdersFilthered = async (
  page: number = 1,
  limit: number = 10,
  filters: TFilters,
  payments: string[]
) => {
  const params = {
    page: page,
    limit: limit,
    ...filters,
  };

  console.log(payments);

  try {
    const response = await api.get(
      `/orders?${payments
        ?.map((p, index) => `payments=${p}${payments.length - 1 === index ? "" : "&"}`)
        .join("")
        .replace(",", "")}`,
      {
        params,
      }
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getOrder = async (id: string) => {
  try {
    const response = await api.get(`/orders/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const searchOrders = async (sku: string) => {
  try {
    const response = await api.get("/orders/search", {
      params: {
        sku: sku,
      },
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const postOrder = async (data: IPostOrder) => {
  try {
    const response = await api.post("/orders", data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putOrder = async (id: string, data: IPutOrder) => {
  try {
    const response = await api.put(`/orders/${id}`, data);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deleteOrder = async (id: string) => {
  try {
    const response = await api.delete(`/orders/${id}`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const checkItem = async (
  id: string,
  item: {
    value: string;
    type: string;
    quantity: number;
    checkedQuantity: number;
  }
) => {
  try {
    const response = await api.put(`/orders/${id}/check`, item);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const separateItems = async (
  id: string,
  item: { local: string; type: string; value: string; quantity: number }
) => {
  try {
    const response = await api.put(`/orders/${id}/items`, item);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const saveOrder = async (id: string) => {
  try {
    const response = await api.put(`/orders/${id}/save`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const checkSaveOrder = async (id: string, items: IChecked[]) => {
  try {
    const response = await api.put(`/orders/${id}/check-save`, {
      Items: items,
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const adjustPendingOrder = async (id: string, Items: { ItemId: string; quantity: number; type: string }[]) => {
  try {
    const response = await api.put(`/orders/${id}/adjust-pending`, {
      Items,
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    return {
      status: 500,
      data: { 
        message: error instanceof Error ? error.message : "Erro inesperado ao editar o pedido",
        error: "Erro interno do servidor"
      }
    };
  }
};

export const confirmPendindOrder = async (id: string) => {
  try {
    const response = await api.put(`/orders/${id}/confirm-pending`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const deliverOrder = async (id: string) => {
  try {
    const response = await api.put(`/orders/${id}/deliver`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const addDock = async (id: string, dock: string) => {
  try {
    const response = await api.put(`/orders/${id}/dock`, { dock });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const taxCouponPdf = async (id: string) => {
  try {
    const response = await api.get(`/orders/${id}/tax-coupon-pdf`, {
      responseType: "blob",
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const putReceiptPayments = async (
  id: string,
  payments: {
    amount: number;
    type: string;
    installment: number;
    proofOfPaymentImageUrl?: string;
    _id?: string;
  }[]
) => {
  console.log(payments);
  const sanatizedPayments = payments.map((payment) => {
    return {
      amount: payment.amount,
      type: payment.type,
      installment: payment.installment > 1 ? payment.installment : undefined,
      proofOfPaymentImageUrl: payment.proofOfPaymentImageUrl || undefined,
      _id: payment._id,
    };
  });

  try {
    const response = await api.put(`/orders/${id}/proof-payment`, {
      ReceiptPayments: sanatizedPayments,
    });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const checkOrderPayments = async (id: string) => {
  try {
    const response = await api.put(`/orders/${id}/check-order-payments`);
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getTopItems = async ({
  page = 1,
  limit = 10,
  search,
  month,
}: {
  page: number;
  limit: number;
  search?: string;
  month?: string;
}) => {
  try {
    const response = await api.get<MostSoldItemsResponse>("/orders/most-sold", {
      params: {
        page,
        limit,
        search,
        month,
      },
    });
    return response?.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw new Error("An unexpected error occurred");
    }
    throw new Error("An unexpected error occurred"); 
  }
};

export const printBoxLabel = async (orderId: string, url: string, quantity: number) => {
  try {
    const response = await api.post(
      `/orders/${orderId}/box-label`,
      {
        url,
        quantity,
      },
      {
        responseType: "blob",
      }
    );
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("An unexpected error occurred");
  }
};

export const getSalesPerformance = async (sellerId: string | undefined, month?: string) => {
  try {
    let url = "/orders/sales-performance";
    if (sellerId) {
      url = `/orders/sales-performance/${sellerId}`;
    }

    const response = await api.get<SellerPerformanceData>(url, { params: { month } });
    return response;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      return error.response;
    }
    throw new Error("Ocorreu um erro inesperado ao buscar o desempenho de vendas.");
  }
};

export const getSalesPerformanceMetrics = async (sellerId: string | undefined, month?: string) => {
    try {
        let url = "/orders/sales-performance-metrics";
        if (sellerId) {
            url = `/orders/sales-performance-metrics/${sellerId}`;
        }
        const response = await api.get<Omit<SellerPerformanceData, 'salesByCategory'>>(url, { params: { month } });
        return response;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return error.response;
        }
        throw new Error("Ocorreu um erro inesperado ao buscar as métricas de desempenho de vendas.");
    }
};

export const getSalesPerformanceCategories = async (sellerId: string | undefined, month?: string, page?: number, limit?: number) => {
    try {
        let url = "/orders/sales-performance-categories";
        if (sellerId) {
            url = `/orders/sales-performance-categories/${sellerId}`;
        }
        const response = await api.get<PaginatedCategorySalesResponse>(url, { params: { month, page, limit } });
        return response;
    } catch (error) {
        if (error instanceof AxiosError && error.response) {
            return error.response;
        }
        throw new Error("Ocorreu um erro inesperado ao buscar as categorias de desempenho de vendas.");
    }
};