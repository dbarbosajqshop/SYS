import { IGetBuild } from "./build";

export interface IPostStreet {
  name: string;
  description: string;
  code: string;
}

export interface IPutStreet {
  _id?: string;
  name: string;
  description: string;
  code: string;
}

export interface IStreetResponse {
  data: IGetStreet[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IPutStreet {
  name: string;
  description: string;
  code: string;
}


export interface IGetStreet {
  _id: string;
  StockId: string;
  name: string;
  description: string;
  code: string;
  Builds: IGetBuild[];
  deletedAt: boolean;
  createdAt: string;
  __v: number;
}