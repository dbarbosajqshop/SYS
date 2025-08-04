import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Check } from "lucide-react";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
  dock: string;
  setDock: (dock: string) => void;
};

export const DockModal = ({
  setOpen,
  open,
  onConfirm,
  dock,
  setDock,
}: Props) => {
  return (
    <div
      className={`${
        open ? "fixed" : "hidden"
      } inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center`}
    >
      <div className="flex flex-col gap-4 items-center min-w-[482px] p-md bg-neutral-0 rounded-sm border border-neutral-200">
        <Subtitle className="text-center" variant="large-semibold">
          Escolher Doca
        </Subtitle>
        <Input
          data={dock}
          onChange={(e) => setDock(e.target.value)}
          placeholder="Digite o código da doca"
          label="Código da Doca"
          maxLength={20}
          wide
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
