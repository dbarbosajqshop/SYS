import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getItemMovementAuditLogs } from "@/services/auditLogs"; 
import { IAuditLogItemMovementResponse, IFetchItemMovementLogsParams } from "@/types/auditLogs";
import { AxiosResponse } from "axios";

export const useItemMovementAuditLogs = () => {
  const [logs, setLogs] = useState<IAuditLogItemMovementResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchLogs = useCallback(async (params: IFetchItemMovementLogsParams = {}) => {
    try {
      setLoading(true);
      const response = await getItemMovementAuditLogs(params);

      if ((response as AxiosResponse).status) {
        const errorResponse = response as AxiosResponse;

        if (errorResponse.status === 401) {
          toast.error("Você não tem permissão para acessar essa página", {
            theme: "colored",
          });
          navigate("/login");
          return;
        }

        if (errorResponse.status === 403) {
          toast.error(errorResponse.data?.message || errorResponse.data?.error, {
            theme: "colored",
          });
          return;
        }

        if (errorResponse.status === 404) {
          setLogs({ data: [], pagination: { total: 0, page: 0, limit: 0, totalPages: 0 } });
          toast.error(errorResponse.data?.message || errorResponse.data?.error, { theme: "colored" });
          return;
        }

        if (errorResponse.status !== 200) {
          toast.error(errorResponse.data?.message || errorResponse.data?.error, {
            theme: "colored",
          });
          return;
        }
      }

      setLogs(response as IAuditLogItemMovementResponse);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message, { theme: "colored" });
      } else {
        toast.error("An unknown error occurred", { theme: "colored" });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    fetchLogs,
  };
};