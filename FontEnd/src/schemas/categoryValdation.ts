import * as Yup from "yup";

const priceValidation = Yup.string()
  .transform((value) => value.replace(",", "."))
  .test("is-decimal", "O campo deve ser um número válido", (value) => {
    return (
      value === null ||
      value === undefined ||
      (value !== undefined && !isNaN(parseFloat(value)) && isFinite(Number(value)))
    );
  });

export const categoryValidation = Yup.object().shape({
  name: Yup.string().required("O nome é obrigatório"),
  description: Yup.string(),
  commission: priceValidation.optional(),
});
