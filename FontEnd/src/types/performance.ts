export interface CategorySales {
  categoryId: string; 
  categoryName: string;
  productsCount: number;
  totalSales: number;
  commissionPercentage: number;
  totalCategoryCommission: number;
}

export interface SellerPerformanceData {
  sellerName: string;
  sellerUsername: string;
  totalSales: number;
  totalCommission: number;
  monthlyGoal: number;
  remainingToGoal: number;
  isGoalAchieved: boolean;
  ordersCount: number;
  canReceiveCommission: boolean;
  salesByCategory: CategorySales[]; 
}

export interface PaginatedCategorySalesResponse {
    data: CategorySales[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}