import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getStockedItemAuditLogs } from "@/services/auditLogs";
import { IAuditLogStockedItemResponse, IFetchStockedItemLogsParams } from "@/types/auditLogs";
import { AxiosResponse } from "axios";

export const useStockedItemAuditLogs = () => {
  const [logs, setLogs] = useState<IAuditLogStockedItemResponse>({
    data: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLogs = useCallback(async (params: IFetchStockedItemLogsParams = {}) => {
    try {
      setLoading(true);
      const response = await getStockedItemAuditLogs(params);

      if ((response as AxiosResponse).status) {
        const errorResponse = response as AxiosResponse;
        if (errorResponse.status === 401) { toast.error("Você não tem permissão para acessar essa página", { theme: "colored" }); navigate("/login"); return; }
        if (errorResponse.status === 403) { toast.error(errorResponse.data?.message || errorResponse.data?.error, { theme: "colored" }); return; }
        if (errorResponse.status === 404) { setLogs({ data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } }); toast.error(errorResponse.data?.message || errorResponse.data?.error, { theme: "colored" }); return; }
        if (errorResponse.status !== 200) { toast.error(errorResponse.data?.message || errorResponse.data?.error, { theme: "colored" }); return; }
      }

      setLogs(response as IAuditLogStockedItemResponse);
    } catch (error) {
      if (error instanceof Error) { toast.error(error.message, { theme: "colored" }); } else { toast.error("An unknown error occurred", { theme: "colored" }); }
      setLogs({ data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return { logs, loading, fetchLogs };
};
