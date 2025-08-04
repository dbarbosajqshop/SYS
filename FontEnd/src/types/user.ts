export interface IUserResponse {
  data: IGetUser[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IPostUser {
  name: string;
  email: string;
  password: string;
  role: string;
}

export interface IGetUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  Roles: Roles[];
  nameImage: string;
  dataImage: {
    data: number[];
    type: string;
  };
  updatedAt: Date;
  deletedAt: boolean | Date;
  updatedBy: Date;
  supervisorPassword?: string;
  createdAt: Date;
}

export interface IPutUser {
  name: string;
  email: string;
  role: string;
}

export interface Roles {
  _id: string;
  name: string;
  permissions?: Permission[]; 
}

export interface Permission {
  _id: string;
  name: string;
}
export interface Seller {
  id: string; 
  name: string; 
}