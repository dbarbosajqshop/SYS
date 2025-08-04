import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getItemSoldPerSeller } from "@/services/items";
import { IItemResponse } from "@/types/items";

type Props = {
  itemId: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

export const useReportItemPerSeller = () => {
  const [sellers, setSellers] = useState<IItemResponse>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchItems = async ({ itemId, page, limit, startDate, endDate }: Props) => {
    try {
      setLoading(true);
      if (startDate && endDate) {
        startDate = startDate.split("/").reverse().join("-");
        endDate = endDate.split("/").reverse().join("-");
      }

      const response = await getItemSoldPerSeller(
        itemId,
        page,
        limit,
        startDate,
        endDate
      );

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
        setSellers({ data: [], totalItems: 0, totalPages: 0, currentPage: 0, limit: 0 });
        toast.error(response.data.message, { theme: "colored" });
        return;
      }

      if (response.status !== 200) {
        toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
        return;
      }

      setSellers(response.data);
    } catch (error) {
      if (error instanceof Error) toast.error(error.message, { theme: "colored" });
      else toast.error("An unknown error occurred", { theme: "colored" });
    } finally {
      setLoading(false);
    }
  };

  return {
    sellers,
    loading,
    fetchItems,
  };
};
