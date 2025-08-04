/* eslint-disable @typescript-eslint/no-explicit-any */
import { IDay } from "@/types/reports";
import { IGetTax } from "@/types/taxes";
import { IGetUser } from "@/types/user";

type calculatePriceAndFormatParams = {
  price: number;
  quantity: number;
  quantityBox: number;
  type?: "box" | "unit";
  taxPrices: boolean;
  wholesalePrice?: number;
  retailPrice?: number;
  discount?: number;
  tax?: IGetTax;
};

export const getNestedValue = (obj: any, path: string) =>
  path.split(".").reduce((acc, part) => acc && acc[part], obj);

// Função para arredondar valores monetários para o centavo mais próximo
const roundCents = (value: number) => {
  const factor = 10 ** 2;
  const n = value * factor;
  const rounded = Math.floor(n);
  const diff = n - rounded;

  if (diff > 0.5) return (rounded + 1) / factor;
  if (diff < 0.5) return rounded / factor;

  // diff === 0.5 → verificar se o inteiro anterior é par
  return (rounded % 2 === 0 ? rounded : rounded + 1) / factor;
};

export const calculatePriceAndFormat = ({
  price,
  quantity,
  quantityBox,
  type = "unit",
  discount = 0,
  tax,
  taxPrices,
  wholesalePrice,
  retailPrice,
}: calculatePriceAndFormatParams): number => {
  let finalPrice = price;

  if (type === "unit") {
    if (tax) {
      const taxPercentage =
        quantity >= tax.minWholesaleQuantity
          ? tax.wholesaleTaxPercentage
          : tax.retailTaxPercentage;
      if (quantity >= quantityBox) finalPrice = price;
      else {
        if (taxPrices)
          finalPrice =
            quantity >= tax.minWholesaleQuantity ? wholesalePrice! : retailPrice!;
        else finalPrice *= (taxPercentage + 100) / 100;
      }
    } else {
      if (taxPrices) finalPrice = quantity >= 2 ? wholesalePrice! : retailPrice!;
      else {
        const multiplier =
          quantity === 1 ? 1.35 : quantity > 1 && quantity < quantityBox ? 1.15 : 1;
        finalPrice *= multiplier;
      }
    }
  }

  finalPrice = roundCents(finalPrice);

  finalPrice -= discount;

  return finalPrice;
};

export const formatMoney = (value: number | string) => {
  if (typeof value === "number") {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }
  if (isNaN(Number(value))) return "N/A";

  return Number(value).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

export const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

export const formatDateGMT = (date: Date | string) =>
  new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "GMT",
  });

export const formatDateTime = (date: Date | string) =>
  new Date(date).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export const formatNumber = (value: number) => {
  const stringValue = value.toString();
  const formattedValue = stringValue.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  return formattedValue;
};

export const handleDateChange = (
  e: string,
  setPurchaseDate: React.Dispatch<React.SetStateAction<string>>
) => {
  let value = e.replace(/\D/g, "");

  if (value.length > 8) {
    value = value.slice(0, 8);
  }

  if (value.length > 2) {
    value = value.slice(0, 2) + "/" + value.slice(2);
  }
  if (value.length > 5) {
    value = value.slice(0, 5) + "/" + value.slice(5);
  }

  if (value.length >= 5) {
    const day = parseInt(value.slice(0, 2), 10);
    const month = parseInt(value.slice(3, 5), 10);

    if (day > 31 || day < 1 || month > 12 || month < 1) {
      return;
    }
  }

  setPurchaseDate(value);
};

export const dateToISO = (date: string) => {
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

export const imgString = (data: number[] | undefined) => {
  if (!data) return "/profile.jpeg";
  return `data:image/jpeg;base64,${btoa(
    Array.from(data, (byte) => String.fromCharCode(byte)).join("")
  )}`;
};

export const userRoles = (profile: IGetUser) => profile.Roles?.map((role) => role.name);

export const handleAmountChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setData: (data: string) => void
) => {
  let number = e.target.value.replace(/\D/g, "");

  number = number.replace(/^0+/, "");

  if (number.length === 1) {
    number = "0" + number;
  }

  if (number.length === 2) {
    number = "0" + number;
  }

  const formatNumber = number.replace(/(\d{1,})(\d{2})$/, "$1,$2");
  setData(formatNumber);
};

export const formatCurrencyText = (value: string) => {
  if (!value) return "";

  const amount = value.toString().replace(/\D/g, "");
  const amountLength = amount.length;
  let formattedAmount = amount.slice(0, amountLength - 2);
  formattedAmount = formattedAmount.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  if (value === "R$ ," || value === "") return "";

  formattedAmount += `,${amount.slice(amountLength - 2)}`;

  return `R$ ${formattedAmount}`;
};

export const formatCurrencyNumber = (value: string) => {
  if (!value) return 0;
  const newValue = value.replace("R$ ", "").replace(".", "").replace(",", ".");
  return newValue ? Number(newValue) : 0;
};

export const formatUnitType = (type: string) =>
  type?.length ? (type === "unit" ? "Unidade" : "Caixa") : "N/A";

export const buildCalendar = (year: number, month: number, days: IDay[]) => {
  const daysInMonth = new Date(year, month, 0).getDate(); // mês já está em 1-12
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay(); // 0=domingo
  const calendar: (IDay | null)[][] = [];
  let week: (IDay | null)[] = [];
  let dayCounter = 1;

  // Preenche os dias vazios antes do primeiro dia do mês
  for (let i = 0; i < firstDayOfWeek; i++) week.push(null);

  while (dayCounter <= daysInMonth) {
    const dayData = days.find((d) => d.day === dayCounter) || {
      day: dayCounter,
      total: 0,
      credito: 0,
      debito: 0,
      keypix: 0,
      machinepix: 0,
      dinheiro: 0,
      ted: 0,
    };
    week.push(dayData);
    if (week.length === 7) {
      calendar.push(week);
      week = [];
    }
    dayCounter++;
  }

  // Preenche os dias vazios após o último dia do mês
  if (week.length > 0) {
    while (week.length < 7) week.push(null);

    calendar.push(week);
  }

  return calendar;
};
