interface IPaymentMethod {
  total: number;
  credito: number;
  debito: number;
  keypix: number;
  machinepix: number;
  dinheiro: number;
  ted: number;
}

export interface IDailyReport {
  year: number;
  month: number;
  totalMonth: IPaymentMethod;
  report: IDay[];
}

export interface IDay extends IPaymentMethod {
  day: number;
}

export interface IMonthlyReport {
  year: number;
  totalYear: IPaymentMethod;
  report: IMonth[];
}

export interface IMonth extends IPaymentMethod {
  month: number;
}
