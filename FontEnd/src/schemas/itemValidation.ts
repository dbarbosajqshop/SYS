import * as Yup from "yup";

const priceValidation = Yup.string()
  .transform((value) => value.replace(",", "."))
  .test("is-decimal", "O campo deve ser um número válido", (value) => {
    return (
      value === null ||
      value === undefined ||
      (value !== undefined && !isNaN(parseFloat(value)) && isFinite(Number(value)))
    );
  })
  .required("Este campo é obrigatório");

export const itemValidationSchema = Yup.object().shape({
  name: Yup.string().required("O nome é obrigatório"),
  sku: Yup.string().required("O SKU é obrigatório"),
  ncm: Yup.string().matches(/^\d{8}$/, "O NCM deve conter 8 dígitos"),
  upcList: Yup.array().of(Yup.string()),
  price: priceValidation,
  wholesalePrice: priceValidation.optional().nullable(),
  retailPrice: priceValidation.optional().nullable(),
  category: Yup.string().required("A categoria é obrigatória"),
  quantityBox: Yup.number()
    .typeError("Quantidade deve ser um número")
    .required("A quantidade é obrigatória"),
  promotionPrice: priceValidation.optional().nullable(),
  depth: priceValidation,
  width: priceValidation,
  height: priceValidation,
  weight: priceValidation,
  color: Yup.string(),
});
