import { ReactNode, useState } from "react";
import { Caption } from "@/ui/typography/Caption";
import { Input } from "@/ui/Input";
import { KeyRound } from "lucide-react";
import { Button } from "@/ui/Button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Column } from "./column";
import { validateSpPassword } from "@/services/users";
import { toast } from "react-toastify";
import useLoadingStore from "@/store/loadingStore";

interface SaleDiscountModalProps {
  children: ReactNode;
  onSuccess: () => void;
}

export const SaleDiscountModal = ({
  children,
  onSuccess,
}: SaleDiscountModalProps) => {
  const [password, setPassword] = useState("");
  const [open, setOpen] = useState(false);

  const { setIsLoading } = useLoadingStore();

  const onSubmit = async () => {
    if (password?.length < 8) return;
    setIsLoading(true);
    try {
      const response = await validateSpPassword(password);
      console.log(response);
      if (response) {
        toast.success("Senha Validada com sucesso!", { theme: "colored" });
        onSuccess();
        setPassword("");
        setOpen(false);
        setIsLoading(false);
        return;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setIsLoading(false);
      toast.error("Senha Inválida", { theme: "colored" });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="flex flex-col gap-6 ">
        <DialogTitle>Aplicar Desconto</DialogTitle>

        <Column className="items-center">
          <Caption variant="large-semibold">
            Insira a senha de supervisão para habilitar o desconto.
          </Caption>
          <Input
            icon={<KeyRound />}
            className="bg-neutral-0 my-0"
            placeholder="Senha"
            data={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            disabled={password?.length < 8}
            variant="primary"
            color="default"
            className="border"
            onClick={() => {
              onSubmit();
            }}
          >
            <Caption variant="large-semibold" color="text-neutral-0">
              Confirmar
            </Caption>
          </Button>
        </Column>
      </DialogContent>
    </Dialog>
  );
};
