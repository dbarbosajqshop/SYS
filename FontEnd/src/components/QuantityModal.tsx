import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Check } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  quantity: string;
  setQuantity: (quantity: string) => void;
  title: string;
};

export const QuantityModal = ({
  setOpen,
  open,
  onConfirm,
  quantity,
  setQuantity,
  title,
}: Props) => {
  const handleNumericInput = (value: string) => {
    if (!isNaN(Number(value))) setQuantity(value);

    return;
  };

  return (
    <div
      className={`${
        open ? "fixed" : "hidden"
      } inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
    >
      <div className="flex flex-col gap-4 items-center min-w-[482px] p-md bg-neutral-0 rounded-sm border border-neutral-200">
        <Subtitle className="text-center" variant="large-semibold">
          {title}
        </Subtitle>
        <Input
          data={quantity}
          onChange={(e) => handleNumericInput(e.target.value)}
          placeholder="Quantidade"
          maxLength={20}
        />
        <div className="flex gap-4">
          <Button variant="naked" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button icon={<Check />} onClick={onConfirm}>
            Confirmar
          </Button>
        </div>
      </div>
    </div>
  );
};
