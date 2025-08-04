import { clientValidationSchema } from "@/schemas/clientValidation";
import { IGetClient, IPostClient } from "@/types/client";
import { DEFAULT_CLIENT_DATA } from "@/constants/index";
import * as Yup from "yup";

export const useCreateClient = (
  clientData: IPostClient,
  setClientData: (client: IPostClient) => void,
  addClient: (client: IPostClient) => Promise<IGetClient | undefined>,
  setErrors: (errors: { [key: string]: string }) => void,
  setOpenModal: (open: boolean) => void,
  setClient?: (clientId: string) => void
) => {
  const handleSubmit = async () => {
    try {
      const adjustedClientData = { ...clientData };

      if (clientData.cpf?.length === 14) {
        adjustedClientData.cnpj = clientData.cpf;
        delete adjustedClientData.cpf;
      } else if (clientData.cpf?.length === 11) {
        adjustedClientData.cpf = clientData.cpf;
        delete adjustedClientData.cnpj;
      }
      await clientValidationSchema.validate(clientData, { abortEarly: false });
      const newClient = await addClient(adjustedClientData);
      setClientData(DEFAULT_CLIENT_DATA);
      setOpenModal(false);
      setErrors({});
      if (newClient) {
        if (setClient) setClient(newClient._id);
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
