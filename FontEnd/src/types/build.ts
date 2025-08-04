import { IGetFloor } from "./floor";

export interface IPostBuild {
  name: string;
  description: string;
  code: string;
}

export interface IPutBuild {
  _id?: string;
  name: string;
  description: string;
  code: string;
}

export interface IBuildResponse {
  data: IGetBuild[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IPutBuild {
  name: string;
  description: string;
  code: string;
}


export interface IGetBuild {
  _id: string;
  StreetId: string;
  name: string;
  description: string;
  code: string;
  Floors: IGetFloor[];
  deletedAt: boolean;
  createdAt: string;
  __v: number;
}