import * as Yup from "yup";

export const taxValidationSchema = Yup.object().shape({
  name: Yup.string().required("O nome é obrigatório"),
  retailTaxPercentage: Yup.number()
    .max(100, "A porcentagem não pode ser maior que 100%!")
    .required("A porcentagem é obrigatória"),
  wholesaleTaxPercentage: Yup.number()
    .max(100, "A porcentagem não pode ser maior que 100%!")
    .required("A porcentagem é obrigatória"),
  minWholesaleQuantity: Yup.number()
    .min(1, "O valor deve ser maior que 0.")
    .required("O valor mínimo é obrigatório"),
  selected: Yup.boolean(),
});
