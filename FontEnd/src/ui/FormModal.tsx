import { Close } from "@/icons/Close";
import { Subtitle } from "./typography/Subtitle";
import { Button } from "./Button";

type ModalProps = {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  entity: string;
  mode: "Criar" | "Editar" | "Movimentar" | "Entrada";
  onSubmit: () => void;
};

export const FormModal = ({
  children,
  open,
  setOpen,
  entity,
  mode,
  onSubmit,
}: ModalProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div
      className={`fixed p-10 left-0 top-0 z-50 flex h-screen w-screen items-center justify-center
      bg-black bg-opacity-50 ${open ? "" : "hidden"} `}
    >
      <form
        onSubmit={handleSubmit}
        className="w-auto sm:w-[620px] overflow-y-auto max-h-full pb-3   bg-neutral-0 rounded-sm border border-neutral-200"
      >
        <div className="flex justify-between h-[77px] p-sm border-b border-neutral-200">
          {mode === "Criar" && (
            <Subtitle variant="large-semibold">
              {mode} {entity}
            </Subtitle>
          )}
          {mode === "Editar" && (
            <Subtitle variant="large-semibold">
              {mode} {entity}
            </Subtitle>
          )}
          {mode === "Movimentar" && (
            <Subtitle variant="large-semibold">Movimentar estoque</Subtitle>
          )}
          <Close onClick={() => setOpen(false)} />
        </div>
        <div className="p-sm">{children}</div>
        <div className="flex justify-end gap-2 px-sm">
          <Button
            variant="naked"
            color="default"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>

          {mode === "Movimentar" && (
            <Button type="submit" variant="primary">
              Movimentar
            </Button>
          )}
          {(mode === "Criar" || mode === "Editar") && (
            <Button type="submit" variant="primary">
              {mode === "Criar" ? `Criar ${entity}` : "Salvar"}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
