export interface ICatalogyResponse {
  data: IGetCatalogy[];
  totalCatalogys: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface IGetCatalogy {
  quantityOfBox: number;
  quantityOfUnits: number;
  ItemId: string;
  sku: string;
  name: string;
  price: number;
  promotionPrice: number;
  isPromotion: boolean;
  taxPrices: boolean;
  wholesalePrice: number;
  retailPrice: number;
  imageUrl?: string;
  totalUnits: number;
  totalBoxes: number;
  quantityBox: number;
}

export interface ICartItem extends IGetCatalogy {
  quantity: number;
  quantityBox: number;
  quantityUnit: number;
  type: "box" | "unit";
  unitPrice: number;
  totalPrice: number;
}
