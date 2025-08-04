import { Close } from "@/icons/Close";
import { Subtitle } from "./typography/Subtitle";
import { Button } from "./Button";

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  entity: string;
  onEdit?: () => void;
};

export const VisualizeModal = ({
  children,
  open,
  setOpen,
  entity,
  onEdit,
}: ModalProps) => {
  return (
    <div
      className={`${
        open ? "fixed" : "hidden"
      } inset-0 bg-black pt-20 bg-opacity-50 flex items-center justify-center z-10 overflow-y-auto`}
    >
      <div className="w-auto sm:w-[620px] bg-neutral-0 rounded-sm border border-neutral-200">
        <div className="flex justify-between h-[77px] p-sm border-b border-neutral-200">
          <Subtitle variant="large-semibold">Visualizar {entity}</Subtitle>
          <Close onClick={() => setOpen(false)} />
        </div>
        <div className="p-sm">{children}</div>
        <div className="flex justify-end gap-2 px-sm">
          <Button variant="naked" color="default" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              if (onEdit) onEdit();
            }}
            variant="primary"
          >
            Editar
          </Button>
        </div>
      </div>
    </div>
  );
};
