import { IGetStreet } from "./street";

export interface IStockResponse {
  data: IGetStock[];
  totals: IStockTotalsInfo;
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IStockTotalsInfo {
  totalStreets: number;
  totalBuilds: number;
  totalFloors: number;
  totalStockedItems: number;
}

export interface IStockTotals {
  streets: number;
  builds: number;
  floors: number;
}

export interface IPostStock {
  name: string;
  description: string;
  code: string;
}

export interface IGetStock {
  Streets: IGetStreet[];
  _id: string;
  name: string;
  description: string;
  code: string;
  deletedAt: boolean;
  createdAt: string;
  __v: number;
  totals: IStockTotals;
}

export interface IPutStock {
  name: string;
  description: string;
  code: string;
}
