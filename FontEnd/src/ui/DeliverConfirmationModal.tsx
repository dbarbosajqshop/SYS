import { Subtitle } from "./typography/Subtitle";
import { Paragraph } from "./typography/Paragraph";
import { Button } from "./Button";
import { Check } from "lucide-react";
import { FaTruckFast } from "react-icons/fa6";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
};

export const DeliverConfirmationModal = ({
  setOpen,
  open,
  onConfirm,
}: Props) => {
  return (
    <div
      className={`${
        open ? "fixed" : "hidden"
      } inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center`}
    >
      <div className="flex flex-col gap-4 items-center min-w-[482px] p-md bg-neutral-0 rounded-sm border border-neutral-200">
        <FaTruckFast className="size-10" />
        <Subtitle className="text-center" variant="large-semibold">
          Entregar Venda
        </Subtitle>
        <Paragraph className="text-center" variant="large">
          Tem certeza que deseja marcar a venda como entregue?
        </Paragraph>
        <div className="flex gap-4">
          <Button variant="naked" onClick={() => setOpen(false)}>
            Não, cancelar
          </Button>
          <Button icon={<Check />} onClick={onConfirm} color="default">
            Sim, Entregar
          </Button>
        </div>
      </div>
    </div>
  );
};
