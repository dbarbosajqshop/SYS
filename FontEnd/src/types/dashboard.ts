export interface DashboardOrders {
  totalVendasMesCount: number;
  totalVendasMesValue: number;
  totalVendasVendedorCount: number; 
  totalVendasVendedorValue: number; 
  pendingOrdersCount: number; 
  pendingOrdersValue: number; 
}
export interface DashboardRegister {
  countItem: number;
  countStreet: number;
  countBuild: number;
  countFloor: number;
}
export interface DashboardStocks {
  order: number;
  orderWaiting: number;
  orderDeliveried: number;
}
export interface DashboardPurchases {
  purchases: number;
  pendingPurchases: number;
  deliveredPurchases: number;
  stockedItems: number;
}