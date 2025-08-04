import { getOrdersDashboard } from "@/services/dashboard";
import { getOrdersFilthered } from "@/services/orders";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export interface TFilters {
  [key: string]: string;
}

export const useReportOrders = () => {
  const [filters, setFilters] = useState<TFilters>({});
  const [page, setPage] = useState(1);
  const [payments, setPayments] = useState<string[]>([]);
  const deboucedPayments = useDebounce(payments, 500);

  const { data: orders } = useQuery({
    queryKey: ["getOrdersReport", page, filters, deboucedPayments],
    queryFn: () => getOrdersFilthered(page, 10, filters, payments),
  });
  
  const { data: ordersDashboard } = useQuery({
    queryKey: ["ordersDashboard", filters, deboucedPayments],
    queryFn: () => getOrdersDashboard(filters, payments),
  });

  const onChangePayments = (value: string) => {
    setPayments((prev) =>
      prev.includes(value) ? prev.filter((e) => e !== value) : [...prev, value]
    );
  };

  const handleSetFilter = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
  };

  return {
    orders: orders?.data, 
    ordersDashboard,
    filters,
    handleSetFilter,
    setFilters,
    setPage,
    onChangePayments,
    payments,
  };
};
