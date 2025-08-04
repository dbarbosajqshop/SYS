export interface ICategoryResponse {
  data: IGetCategory[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IGetCategory {
  _id: string;
  name: string;
  description: string;
  commission: number;
  active: boolean;
  createdAt: string;
  __v: number;
}

export interface IPostCategory {
  name: string;
  description?: string;
  commission?: number;
}
