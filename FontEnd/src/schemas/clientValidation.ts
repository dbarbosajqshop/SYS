import * as Yup from "yup";

const brazilianStates = [
  "ac", "al", "ap", "am", "ba", "ce", "df", "es", "go", "ma", "mt", "ms", "mg",
  "pa", "pb", "pr", "pe", "pi", "rj", "rn", "rs", "ro", "rr", "sc", "sp", "se", "to"
];

export const clientValidationSchema = Yup.object().shape({
  name: Yup.string().required("O nome é obrigatório"),
  cpf: Yup.string()
    .required("O CPF ou CNPJ é obrigatório")
    .test(
      "cpf-cnpj-length",
      "O CPF deve ter 11 dígitos ou o CNPJ deve ter 14 dígitos",
      (value) => {
        const formattedValue = value?.replace(/[^\d]/g, "");
        return !value || formattedValue.length === 11 || formattedValue.length === 14;
      }
    ),
  email: Yup.string().email("E-mail inválido").required("O e-mail é obrigatório"),
  telephoneNumber: Yup.string()
    .length(11, "O telefone deve ter 11 dígitos")
    .required("O telefone é obrigatório"),
  address: Yup.object().shape({
    street: Yup.string().required("A rua é obrigatória"),
    neighborhood: Yup.string().required("O bairro é obrigatório"),
    state: Yup.string()
      .length(2, "O estado deve ter 2 caracteres")
      .required("O estado é obrigatório")
      .test(
        "state-validation",
        "Estado inválido",
        (value) => brazilianStates.includes(value?.toLowerCase() || "")
      ),
    zip: Yup.string()
      .length(8, "O CEP deve ter 8 dígitos")
      .required("O CEP é obrigatório"),
    number: Yup.string().required("O número é obrigatório"),
    complement: Yup.string(),
    city: Yup.string().required("A cidade é obrigatória"),
  }),
});
