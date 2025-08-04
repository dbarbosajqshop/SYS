export interface IDockResponse {
  data: IGetDock[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IGetDock {
  _id: string;
  code: string;
}

export interface IPostDock {
  code: string;
}
