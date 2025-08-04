export interface Payment {
  type: string;
  installment?: number;
  amount: number;
}

export interface IPostCart {
  Items: CartItem[];
  ClientId?: string;
  SellerId: string;
  itemsQuantity: number;
  totalQuantity: number;
  discount: number;
  local?: string;
  typeOfDelivery: string;
  status?: string;
  payments: Payment[];
  deliveryAddress?: {
    street: string;
    neighborhood: string;
    state: string;
    zip: string;
    number: string;
    complement?: string;
    city: string;
  };
}

export interface CartItem {
  ItemId: string;
  quantity: number;
}

export interface IGetCart {
  paymentStatus: string;
  _id: string;
  totalPrice: number;
  subtotalPrice: number;
  discount: number;
  active: boolean;
  Items: CartItem[];
  createdAt: string;
  __v: number;
  typeOfPayment: string;
}

export interface IGetCashier {
  _id: string;
  cashInCashier: number;
  cashierUserLogin: string;
  creditCartValue: number;
  debitCartValue: number;
  pixValue: number;
  cashValue: number;
  totalOrders: number;
  reimbursement: number;
  createdBy: string;
  active: boolean;
  createdAt: string;
  __v: number;
}
