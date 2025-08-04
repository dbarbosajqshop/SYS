export interface IPostFloor {
  name: string;
  description: string;
  code: string;
  orderLocal: "online" | "presencial";
}

export interface IPutFloor {
  _id?: string;
  name: string;
  description: string;
  code: string;
  orderLocal: "online" | "presencial";
}

export interface IFloorResponse {
  data: IGetFloor[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IGetFloor {
  _id: string;
  BuildId: string;
  name: string;
  description: string;
  code: string;
  orderLocal: "online" | "presencial";
  StockedItems: string[]; // This should be an array of StockItems
  deletedAt: boolean;
  createdAt: string;
  __v: number;
}

export interface IGetLocals {
  stockCode: string;
  streetCode: string;
  buildCode: string;
  floorCode: string;
}
