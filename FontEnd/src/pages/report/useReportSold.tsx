import { useState, useCallback } from "react"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getItemsSold } from "@/services/items";
import { IItemResponse } from "@/types/items";

type Props = {
  page?: number;
  limit?: number;
  param?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

export const useReportSold = () => {
  const [items, setItems] = useState<IItemResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const fetchItems = useCallback(async ({
    page,
    limit,
    param,
    search,
    startDate,
    endDate,
  }: Props = {}) => {
    try {
      setLoading(true);
      let formattedStartDate = startDate;
      let formattedEndDate = endDate;

      if (formattedStartDate && formattedEndDate) {
        formattedStartDate = formattedStartDate.split("/").reverse().join("-");
        formattedEndDate = formattedEndDate.split("/").reverse().join("-");
      }

      const response = await getItemsSold(page, limit, param, search, formattedStartDate, formattedEndDate);

      if (response.status === 401) {
        toast.error("Você não tem permissão para acessar essa página", {
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
        setItems({ data: [], totalItems: 0, totalPages: 0, currentPage: 0, limit: 0 });
        toast.error(response.data.message, { theme: "colored" });
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }

      setItems(response.data);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message, { theme: "colored" });
      else toast.error("An unknown error occurred", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  }, [navigate]); 

  return {
    items,
    loading,
    fetchItems,
  };
};