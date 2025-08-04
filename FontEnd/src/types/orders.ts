export interface IOrderResponse {
  data: IGetOrder[];
  totalOrders: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IOrderTotals {
  streets: number;
  builds: number;
  floors: number;
}

export interface IPostOrder {
  sku: string;
  upc: number;
  name: string;
  description: string;
  price: number;
  promotionPrice: number;
  height: number;
  width: number;
  depth: number;
  weight: number;
  quantityBox: number;
  color: string;
  dataImage?: {
    data: number[];
    type: "Buffer";
  };
}

export interface IGetPayment {
  _id: string;
  amount: number;
  type: string;
  proofOfPaymentImageUrl?: string;
}

export interface IGetOrder {
  _id: string;
  Items: OrderItem[];
  ClientId: Client;
  SellerId: Seller;
  itemsQuantity: number;
  totalQuantity: number;
  totalPrice: number;
  totalPaid: number;
  subtotalPrice: number;
  discount: number;
  observation: string;
  local: string;
  paymentStatus: string;
  ReceiptPayments: IGetPayment[];
  typeOfDelivery: string;
  deliveryAddress?: { 
    street: string;
    neighborhood: string;
    state: string;
    zip: string;
    number: string;
    complement?: string;
    city: string;
  };
  status: string;
  active: boolean;
  dateOfOrder: string;
  orderNumber: number;
  createdAt: string;
  __v: number;
}

export interface OrderItem {
  itemStatus: string;
  ItemId: Item;
  quantity: number;
  imageUrl: string | null;
  _id: string;
  type?: string;
  localToBeRemoved?: string;
  unitPrice?: number;
  price?: number;
  isPromotion?: boolean;
  taxPrices?: boolean;
  promotionPrice?: number;
  wholesalePrice?: number;
  retailPrice?: number;
  tax?: {
    minWholesaleQuantity?: number;
    wholesaleTaxPercentage?: number;
    retailTaxPercentage?: number;
  };
}

export const UnitTypeOptions = [
  { value: "unit", label: "Unidade" },
  { value: "box", label: "Caixa" },
];

interface Item {
  _id: string;
  sku: string;
  upc?: string;
  name: string;
  price: number;
}

interface Client {
  _id: string;
  name: string;
}

interface Seller {
  _id: string;
  name: string;
}

export interface INewOrder extends IGetOrder {
  quantity: number;
}

export interface IPutOrder {
  Items?: { ItemId: string; quantity: number }[];
  ClientId: {
    _id: string;
    name: string;
  };
  SellerId: {
    _id: string;
    name: string;
  };
  payments: IGetPayment[];
  itemsQuantity: number;
  totalQuantity: number;
  totalPrice: number;
  subtotalPrice: number;
  discount: number;
  local: string;
  typeOfDelivery: string;
  status: string;
}
export interface MostSoldItem {
  itemId: string;
  itemImageUrl?: string; // Optional in case some items don't have images
  itemName: string;
  itemSku: string;
  itemUpc?: string; // Optional as UPC might not exist for all items
  totalQuantitySold: number;
  timesOrdered: number;
  price: number;
  wholesalePrice?: number; // Optional as not all items might have wholesale price
  totalSales: number;
  averagePrice: number;
}

export interface PaginationMetadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface SalesTotals {
  grandTotalSales: number;
  grandTotalQuantity: number;
}

export interface MostSoldItemsResponse {
  data: MostSoldItem[]; // Paginated results (with search filters if applied)
  top10Items: MostSoldItem[]; // Absolute top 10 items (unfiltered by search)
  pagination: PaginationMetadata;
  totals: SalesTotals;
}

// Optional: Types for request parameters
export interface MostSoldItemsParams {
  limit?: number;
  page?: number;
  timePeriod?: "day" | "week" | "month" | "year";
  search?: string;
  month?: string; // YYYY-MM format
}
