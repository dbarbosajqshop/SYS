import { useEffect, useState } from "react";
import { verifyCashier, openCashier, closeCashier } from "@/services/carts";
import { IGetCashier } from "@/types/carts";
import { toast } from "react-toastify";

export const useCashier = () => {
  const [cashier, setCashier] = useState<IGetCashier | false>(false);
  const [loading, setLoading] = useState(true);

  const fetchCashier = async () => {
    try {
      setLoading(true);
      const response = await verifyCashier();
      if (response.status !== 200) return setCashier(false);
      return setCashier(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const open = async (cashInCashier: number) => {
    try {
      setLoading(true);
      const response = await openCashier(cashInCashier);
      if (response.status !== 200)
        return toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
      return setCashier(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const close = async () => {
    try {
      setLoading(true);
      const response = await closeCashier();
      if (response.status !== 200)
        return toast.error(response.data.message || response.data.error, {
          theme: "colored",
        });
      return setCashier(false);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashier();
  }, []);

  return { fetchCashier, cashier, loading, open, close };
};
