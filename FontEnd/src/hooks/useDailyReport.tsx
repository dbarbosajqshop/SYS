import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IDailyReport } from "@/types/reports";
import { getDailyReport } from "@/services/reports";

type Props = {
  month?: number;
  year?: number;
};

export const useDailyReport = () => {
  const [report, setReport] = useState<IDailyReport>({} as IDailyReport);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReport = async ({ month, year }: Props = {}) => {
    try {
      setLoading(true);

      const response = await getDailyReport({ month, year });

      if (response.status === 401) {
        toast.error("Você não tem permissão para acessar essa página");
        navigate("/login");
        return;
      }

      if (response.status === 403) {
        toast.error(response.data.message || response.data.error);
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error);
        return;
      }

      setReport(response.data);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      else toast.error("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    report,
    loading,
    fetchReport,
  };
};
