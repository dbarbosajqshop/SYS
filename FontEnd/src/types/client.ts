export interface IClientResponse {
  data: IGetClient[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IGetClient {
  address: IClientAddress;
  _id: string;
  name: string;
  cnpj: string;
  cpf: string;
  email: string;
  purchases: string[]; // alterar
  telephoneNumber: string;
  active: boolean;
  createdAt: string;
  __v: number;
}

export interface IPostClient {
  address: IClientAddress;
  name: string;
  cnpj?: string;
  cpf?: string;
  email: string;
  telephoneNumber: string;
}

export interface IPutClient {
  address?: IClientAddress;
  name?: string;
  cnpj?: string;
  cpf?: string;
  email?: string;
  telephoneNumber?: string;
}

export interface IClientAddress {
  street: string;
  neighborhood: string;
  state: string;
  zip: string;
  number: string;
  complement?: string;
  city: string;
}

export interface IPostShipment {
  deliveryType: string;
  address: IClientAddress;
}
