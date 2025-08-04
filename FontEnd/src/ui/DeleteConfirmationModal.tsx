import { TrashDelete } from "@/icons/TrashDelete";
import { Subtitle } from "./typography/Subtitle";
import { Paragraph } from "./typography/Paragraph";
import { Button } from "./Button";
import { Delete } from "@/icons/Delete";

type Props = {
  title: string;
  description?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  onConfirm: () => void;
};

export const DeleteConfirmationModal = ({
  title,
  description,
  setOpen,
  open,
  onConfirm,
}: Props) => {
  return (
    <div
      className={`${
        open ? "fixed" : "hidden"
      } inset-0 bg-black bg-opacity-50 flex items-center justify-center`}
    >
      <div className="flex flex-col gap-4 items-center min-w-[482px] p-md bg-neutral-0 rounded-sm border border-neutral-200">
        <TrashDelete />
        <Subtitle className="text-center" variant="large-semibold">{title}</Subtitle>
        <Paragraph className="text-center" variant="large">{description}</Paragraph>
        <div className="flex gap-4">
          <Button variant="naked" onClick={() => setOpen(false)}>
          Não, cancelar
          </Button>
          <Button icon={<Delete />} onClick={onConfirm} color="destruct">
          Sim, excluir
          </Button>
        </div>
      </div>
    </div>
  );
};
