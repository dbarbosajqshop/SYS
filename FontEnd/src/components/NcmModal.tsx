import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Check } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  ncm: string;
  setNcm: (quantity: string) => void;
};

export const NcmModal = ({
  setOpen,
  open,
  onConfirm,
  ncm,
  setNcm,
}: Props) => {
  const handleNumericInput = (value: string) => {
    if (!isNaN(Number(value))) setNcm(value);

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
          Defina o novo NCM
        </Subtitle>
        <Input
          data={ncm}
          onChange={(e) => handleNumericInput(e.target.value)}
          placeholder="NCM"
          maxLength={8}
        />
        <div className="flex gap-4">
          <Button variant="naked" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button icon={<Check />} onClick={onConfirm}>
            Alterar
          </Button>
        </div>
      </div>
    </div>
  );
};
