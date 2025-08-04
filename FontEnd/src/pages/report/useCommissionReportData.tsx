import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { SellerPerformanceData, PaginatedCategorySalesResponse } from "@/types/performance";
import { getSalesPerformanceMetrics, getSalesPerformanceCategories } from "@/services/orders";

interface UseCommissionReportDataProps {
  selectedMonth?: dayjs.Dayjs;
  selectedSellerId?: string;
  hasAdminRole: boolean;
  profileId?: string;
  categoryPage?: number; 
  categoryLimit?: number;
}

const initialPerformanceData: SellerPerformanceData = {
  sellerName: "",
  sellerUsername: "",
  totalSales: 0,
  totalCommission: 0,
  monthlyGoal: 500000.0,
  remainingToGoal: 500000.0,
  isGoalAchieved: false,
  ordersCount: 0,
  canReceiveCommission: false,
  salesByCategory: [],
};

const initialPaginatedCategorySales: PaginatedCategorySalesResponse = {
    data: [],
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false,
}

export const useCommissionReportData = ({
  selectedMonth,
  selectedSellerId,
  hasAdminRole,
  profileId,
  categoryPage = 1, 
  categoryLimit = 5,
}: UseCommissionReportDataProps) => {
  const [performanceData, setPerformanceData] = useState<SellerPerformanceData>(
    initialPerformanceData
  );
  const [paginatedCategories, setPaginatedCategories] = useState<PaginatedCategorySalesResponse>(
    initialPaginatedCategorySales
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      setLoading(true);
      try {
        const monthFormatted = selectedMonth ? selectedMonth.format("YYYY-MM") : undefined;
        let targetSellerId: string | undefined = undefined;

        if (hasAdminRole) {
          targetSellerId = selectedSellerId;
        } else if (profileId) {
          targetSellerId = profileId;
        } else {
          setLoading(false);
          setPerformanceData(initialPerformanceData);
          setPaginatedCategories(initialPaginatedCategorySales);
          return;
        }

        if (targetSellerId !== undefined || (hasAdminRole && selectedSellerId === undefined)) {
            const metricsResponse = await getSalesPerformanceMetrics(targetSellerId, monthFormatted);

            if (metricsResponse.status === 200) {
                setPerformanceData(prev => ({ ...prev, ...metricsResponse.data }));
            } else {
                toast.error("Erro ao carregar dados de métricas de desempenho.", { theme: "colored" });
                setPerformanceData(initialPerformanceData);
            }

            const categoriesResponse = await getSalesPerformanceCategories(
                targetSellerId,
                monthFormatted,
                categoryPage,
                categoryLimit
            );

            if (categoriesResponse.status === 200) {
                setPaginatedCategories(categoriesResponse.data);
                setPerformanceData(prev => ({ ...prev, salesByCategory: categoriesResponse.data.data })); 
            } else {
                toast.error("Erro ao carregar dados de categorias de desempenho.", { theme: "colored" });
                setPaginatedCategories(initialPaginatedCategorySales);
                setPerformanceData(prev => ({ ...prev, salesByCategory: [] }));
            }

        } else {
            setPerformanceData(initialPerformanceData);
            setPaginatedCategories(initialPaginatedCategorySales);
        }

      } catch (error) {
        toast.error("Erro ao carregar dados de desempenho.", { theme: "colored" });
        console.error("Erro ao buscar dados de desempenho:", error);
        setPerformanceData(initialPerformanceData);
        setPaginatedCategories(initialPaginatedCategorySales);
      } finally {
        setLoading(false);
      }
    };
    if (profileId || hasAdminRole) {
      fetchPerformance();
    } else {
      setLoading(false);
      setPerformanceData(initialPerformanceData);
      setPaginatedCategories(initialPaginatedCategorySales);
    }
  }, [selectedMonth, selectedSellerId, hasAdminRole, profileId, categoryPage, categoryLimit]);

  return { performanceData, paginatedCategories, loading };
};