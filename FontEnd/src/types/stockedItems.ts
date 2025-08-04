export interface IStockedItemResponse {
  data: IGetStockedItem[]; 
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IStockedItemOverviewResponse {
  data: IGetStockedItemOverview[]; 
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IPostStockedItem {
  store: string;
  stockedItemDate: string;
  Items: IStockedItemItems[];
}

interface IStockedItemItems {
  itemId: string;
  boxQuantity: number;
  boxValue: number;
}

export interface IGetStockedItem {
  _id: string;
  name: string;
  sku: string;
  upcList: number[];
  imageUrl?: string; 
  category?: string; 
  quantityBox?: number; 
  ItemId: string;
  FloorId: string;
  local: string;
  type: string;
  quantity: number; 
  reservedQuantity: number; 
  availableQuantity: number; 
  active: boolean;
  createdAt: string;
  __v: number;
}

export interface IGetStockedItemOverview {
  _id: string; 
  name: string;
  sku: string;
  upcList: number[];
  imageUrl?: string;
  category?: string;
  quantityBox: number; 
  totalQuantityInUnits: number; 
  totalReservedQuantityInUnits: number;
  totalAvailableQuantityInUnits: number; 
  stockedQuantityBox: number; 
  stockedQuantityUnit: number; 
  reservedQuantityBox: number; 
  reservedQuantityUnit: number; 
  availableQuantityBox: number; 
  availableQuantityUnit: number; 
}

export interface IPutStockedItem {
  name: string;
  description: string;
  code: string;
}

export interface ITransferStockedItem {
  local: string;
  quantity: number;
  type: string;
}