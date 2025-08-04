import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getStockAuditLogs } from "@/services/auditLogs"; 
import { IAuditLogStockResponse, IFetchStockLogsParams } from "@/types/auditLogs";
import { AxiosResponse } from "axios";

export const useStockAuditLogs = () => {
  const [logs, setLogs] = useState<IAuditLogStockResponse>({
    data: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLogs = useCallback(async (params: IFetchStockLogsParams = {}) => {
    try {
      setLoading(true);
      const response = await getStockAuditLogs(params);

      if ((response as AxiosResponse).status) {
        const errorResponse = response as AxiosResponse;
        if (errorResponse.status === 401) { toast.error("Você não tem permissão para acessar essa página", { theme: "colored" }); navigate("/login"); return; }
        if (errorResponse.status === 403) { toast.error(errorResponse.data?.message || errorResponse.data?.error, { theme: "colored" }); return; }
        if (errorResponse.status === 404) { setLogs({ data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } }); toast.error(errorResponse.data?.message || errorResponse.data?.error, { theme: "colored" }); return; }
        if (errorResponse.status !== 200) { toast.error(errorResponse.data?.message || errorResponse.data?.error, { theme: "colored" }); return; }
      }

      setLogs(response as IAuditLogStockResponse);
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