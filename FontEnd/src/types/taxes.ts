export interface ITaxResponse {
  data: IGetTax[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IGetTax {
  _id: string;
  name: string;
  retailTaxPercentage: number;
  wholesaleTaxPercentage: number;
  minWholesaleQuantity: number;
  selected: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IPostTax {
  name: string;
  retailTaxPercentage: number;
  wholesaleTaxPercentage: number;
  minWholesaleQuantity: number;
  selected: boolean;
}
