import { IGetDock, IPostDock } from "@/types/docks";
import * as Yup from "yup";

export const useCreateDock = (
  dockData: IPostDock,
  setDockData: (Dock: IPostDock) => void,
  addDock: (Dock: IPostDock) => Promise<IGetDock | undefined>,
  setErrors: (errors: { [key: string]: string }) => void,
  setOpenModal: (open: boolean) => void,
  setDock?: (DockId: string) => void
) => {
  const handleSubmit = async () => {
    try {
      const newDock = await addDock(dockData);
      setDockData({
        code: "",
      });
      setOpenModal(false);
      setErrors({});
      if (newDock) {
        if (setDock) setDock(newDock._id);
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
