import { DEFAULT_ITEM_DATA } from "@/constants";
import { itemValidationSchema } from "@/schemas/itemValidation";
import { IGetItem, IPostItem } from "@/types/items";
import * as Yup from "yup";

export const useCreateItem = (
  itemData: IPostItem,
  setItemData: (item: IPostItem) => void,
  addItem: (item: IPostItem) => Promise<IGetItem>,
  setErrors: (errors: { [key: string]: string }) => void,
  setOpenModal: (open: boolean) => void,
  itemPhoto?: File | null,
  savePhoto?: (id: string, photo: File) => void
) => {
  const handleSubmit = async () => {
    try {
      await itemValidationSchema.validate(itemData, { abortEarly: false });
      const formatedData = {
        ...itemData,
        price: Number(itemData.price.toString().replace(",", ".")),
        promotionPrice: Number(itemData?.promotionPrice?.toString().replace(",", ".")),
        wholesalePrice: Number(itemData?.wholesalePrice?.toString().replace(",", ".")),
        retailPrice: Number(itemData?.retailPrice?.toString().replace(",", ".")),
        upcList: itemData.upcList,
      };
      const newItem = await addItem(formatedData);
      if (itemPhoto && savePhoto) {
        savePhoto(newItem._id, itemPhoto);
      }
      setItemData(DEFAULT_ITEM_DATA);
      setOpenModal(false);
      setErrors({});
      return newItem;
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
