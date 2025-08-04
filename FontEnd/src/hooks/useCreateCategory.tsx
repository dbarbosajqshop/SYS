import { IGetCategory, IPostCategory } from "@/types/categories";
import { categoryValidation } from "@/schemas/categoryValdation";
import * as Yup from "yup";

export const useCreateCategory = (
  CategoryData: IPostCategory,
  setCategoryData: (Category: IPostCategory) => void,
  addCategory: (Category: IPostCategory) => Promise<IGetCategory | undefined>,
  setErrors: (errors: { [key: string]: string }) => void,
  setOpenModal: (open: boolean) => void,
  setCategory?: (CategoryId: string) => void
) => {
  const handleSubmit = async () => {
    try {
      await categoryValidation.validate(CategoryData, { abortEarly: false });
      const formattedData = {
        ...CategoryData,
        commission: CategoryData.commission
          ? Number(CategoryData.commission?.toString().replace(",", "."))
          : 0,
      };
      const newCategory = await addCategory(formattedData);
      setCategoryData({
        name: "",
        description: "",
        commission: 0,
      });
      setOpenModal(false);
      setErrors({});
      if (newCategory) {
        if (setCategory) setCategory(newCategory._id);
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
