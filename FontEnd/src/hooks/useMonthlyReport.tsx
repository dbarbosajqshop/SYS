import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { IMonthlyReport } from "@/types/reports";
import { getMonthlyReport } from "@/services/reports";

type Props = {
  year?: number;
};

export const useMonthlyReport = () => {
  const [report, setReport] = useState<IMonthlyReport>({} as IMonthlyReport);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchReport = async ({ year }: Props = {}) => {
    try {
      setLoading(true);

      const response = await getMonthlyReport({ year });

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
