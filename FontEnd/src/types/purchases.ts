export interface IPurchaseResponse {
  data: IGetPurchase[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IPostPurchase {
  store: string;
  purchaseDate: string;
  Items: IPurchaseItems[];
}

interface IPurchaseItems {
  itemId: string;
  boxQuantity: number;
  boxValue: number;
}

export interface IGetPurchase {
  _id: string;
  Items: PurchaseItem[];
  totalItems: number;
  totalValue: number;
  store: string;
  purchaseDate: string;
  state: string;
  active: boolean;
  createdAt: string;
  __v: number;
}

export interface IPutPurchase {
  name: string;
  description: string;
  code: string;
}

interface PurchaseItem {
  itemId: ItemData;
  boxQuantity: number;
  boxValue: number;
  finalPrice: number;
  _id: string;
}

interface ItemData {
  _id: string;
  name: string;
  sku: string;
  upc: number;
}
