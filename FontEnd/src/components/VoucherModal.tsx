import { Close } from "@/icons/Close";
import { Button } from "@/ui/Button";
import { Subtitle } from "@/ui/typography/Subtitle";
import { handleAmountChange } from "@/helpers";
import { Input } from "@/ui/Input";
import { Monetization } from "@/icons/Monetization";

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  clientVoucher: string;
  clientId: string;
  setClientVoucher: (voucher: string) => void;
  addVoucher: (client: string, voucher: number) => void;
};

export const VoucherModal = ({
  open,
  setOpen,
  clientVoucher,
  setClientVoucher,
  addVoucher,
  clientId,
}: ModalProps) => {
  const handleClose = () => {
    addVoucher(clientId, parseFloat(clientVoucher));
    setOpen(false);
  };

  return (
    <div
      className={`${
        open ? "fixed" : "hidden"
      } inset-0 bg-black pt-20 bg-opacity-50 flex items-center justify-center z-10 overflow-y-auto`}
    >
      <div className="w-min sm:w-[620px] bg-neutral-0 rounded-sm border border-neutral-200">
        <div className="flex justify-between h-[77px] p-sm border-b border-neutral-200">
          <Subtitle variant="large-semibold">Inserir voucher</Subtitle>
          <Close onClick={() => setOpen(false)} />
        </div>
        <div className="p-sm">
          <Input
            wide
            label="Valor do voucher"
            placeholder="Digite o valor do voucher"
            iconPosition="left"
            icon={<Monetization color="green" />}
            data={clientVoucher}
            onChange={(e) => handleAmountChange(e, setClientVoucher)}
          />
        </div>

        <div className="flex justify-end gap-2 px-sm py-xxs border-t">
          <Button variant="naked" color="default" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleClose} variant="primary">
            Inserir Voucher
          </Button>
        </div>
      </div>
    </div>
  );
};
