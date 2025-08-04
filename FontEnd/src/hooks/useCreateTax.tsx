import { IGetTax, IPostTax } from "@/types/taxes";
import { taxValidationSchema } from "@/schemas/taxValidation";
import * as Yup from "yup";
import { DEFAULT_TAX_DATA } from "@/constants";

export const useCreateTax = (
  taxData: IPostTax,
  setTaxData: (Tax: IPostTax) => void,
  addTax: (Tax: IPostTax) => Promise<IGetTax | undefined>,
  setErrors: (errors: { [key: string]: string }) => void,
  setOpenModal: (open: boolean) => void,
  setTax?: (TaxId: string) => void
) => {
  const handleSubmit = async () => {
    try {
      await taxValidationSchema.validate(taxData, { abortEarly: false });
      const newTax = await addTax(taxData);
      setTaxData(DEFAULT_TAX_DATA);
      setOpenModal(false);
      setErrors({});
      if (newTax) {
        if (setTax) setTax(newTax._id);
      }
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
