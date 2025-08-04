import { toast } from "react-toastify";

export const redirectWarning = () =>
  toast.warning(
    "A tela inicial está em desenvolvimento. Você foi redirecionado para a configuração do usuário.",
    { theme: "colored" }
  );
