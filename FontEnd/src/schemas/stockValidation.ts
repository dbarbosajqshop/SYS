import * as Yup from "yup";

export const stockValidationSchema = Yup.object().shape({
  name: Yup.string().required("O nome é obrigatório"),
  code: Yup.string().length(3).required("O código deve ter 3 caracteres"),
  description: Yup.string().required("A descrição é obrigatória"),
});
