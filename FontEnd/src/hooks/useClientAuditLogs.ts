import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getClientAuditLogs } from "@/services/auditLogs"; 
import { IAuditLogClientResponse, IFetchClientLogsParams } from "@/types/auditLogs";
import { AxiosResponse } from "axios";

export const useClientAuditLogs = () => {
  const [logs, setLogs] = useState<IAuditLogClientResponse>({
    data: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLogs = useCallback(async (params: IFetchClientLogsParams = {}) => {
    try {
      setLoading(true);
      const response = await getClientAuditLogs(params);

      if ((response as AxiosResponse).status) {
        const errorResponse = response as AxiosResponse;
        if (errorResponse.status === 401) {
          toast.error("Você não tem permissão para acessar essa página", { theme: "colored" });
          navigate("/login");
          return;
        }
        if (errorResponse.status === 403) {
          toast.error(errorResponse.data?.message || errorResponse.data?.error, { theme: "colored" });
          setLogs({ data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } });
          return;
        }
        if (errorResponse.status === 404) {
          toast.error(errorResponse.data?.message || errorResponse.data?.error, { theme: "colored" });
          setLogs({ data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } });
          return;
        }
        if (errorResponse.status !== 200) {
          toast.error(errorResponse.data?.message || errorResponse.data?.error, { theme: "colored" });
          setLogs({ data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } });
          return;
        }
      }

      setLogs(response as IAuditLogClientResponse);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
      setLogs({ data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return { logs, loading, fetchLogs };
};