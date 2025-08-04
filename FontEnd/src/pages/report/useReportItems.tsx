import { formatCurrencyText } from "@/helpers";
import { getTopItems } from "@/services/orders";
import { MostSoldItemsResponse } from "@/types/orders";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export const useReportItems = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const debouncedSearch = useDebounce(search, 500);

  const { data: items } = useQuery({
    queryKey: ["getTopItems", page, debouncedSearch, selectedMonth],

    queryFn: () =>
      getTopItems({
        page,
        limit: 10,
        search,
        month: selectedMonth.format("YYYY-MM"),
      }),
  });

  const sanatizeItems = () => {
    return {
      ...items,
      data: items?.data?.map((item) => {
        return {
          ...item,
          price: formatCurrencyText(item.price.toFixed(2).toString()),
          totalSales: formatCurrencyText(item.totalSales.toFixed(2).toString()),
        };
      }),
    };
  };

  return {
    items: sanatizeItems() as unknown as MostSoldItemsResponse,
    page,
    setPage,
    setSearch,
    selectedMonth,
    setSelectedMonth,
  };
};
