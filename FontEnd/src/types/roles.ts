export interface IRoleResponse {
  data: IGetRole[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IGetRole {
  _id: string;
  name: string;
  permissions: Permission[];
  active: boolean;
  createdBy: Date;
  createdAt: Date;
}

interface Permission {
  _id: string;
  name: string;
}
