import { DEFAULT_STOCK_DATA } from "@/constants";
import { stockValidationSchema } from "@/schemas/stockValidation";
import { IPostStock, IPutStock } from "@/types/stock";
import * as Yup from "yup";

export const useCreateStock = (
  stockData: IPostStock | IPutStock,
  setStockData: (item: IPostStock | IPutStock) => void,
  addStock: (item: IPostStock) => void,
  updateStock: (id: string, item: IPutStock) => void,
  setErrors: (errors: { [key: string]: string }) => void,
  setModalOpen: (open: boolean) => void,
  isEditing: boolean = false,
  stockId: string = ""
) => {
  const handleSubmit = async () => {
    try {
      await stockValidationSchema.validate(stockData, { abortEarly: false });

      if (isEditing) {
        updateStock(stockId, stockData as IPutStock);
      } else {
        addStock(stockData as IPostStock);
      }

      setStockData(DEFAULT_STOCK_DATA);
      setModalOpen(false);
      setErrors({});
    } catch (validationErrors) {
      const newErrors: { [key: string]: string } = {};
      (validationErrors as Yup.ValidationError).inner.forEach(
        (error: Yup.ValidationError) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        }
      );
      setErrors(newErrors);
    }
  };

  return { handleSubmit };
};
