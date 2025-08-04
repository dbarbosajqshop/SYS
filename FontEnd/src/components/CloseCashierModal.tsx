import { Close } from "@/icons/Close";
import { Button } from "@/ui/Button";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";
import { IGetCashier } from "@/types/carts";
import { formatMoney } from "@/helpers";

type ModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  cashierData: IGetCashier;
  onClose: () => void;
};

export const CloseCashierModal = ({ open, setOpen, cashierData, onClose }: ModalProps) => {
  const handleClose = () => {
    onClose();
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
          <Subtitle variant="large-semibold">Fechar caixa</Subtitle>
          <Close onClick={() => setOpen(false)} />
        </div>
        <div className="p-sm">
          <Subtitle variant="large-semibold">Resumo</Subtitle>
          <div>
            <div className="flex justify-between mt-4">
              <Paragraph variant="large-semibold">Fundo de caixa:</Paragraph>
              <Paragraph>{formatMoney(cashierData.cashInCashier)}</Paragraph>
            </div>
            <div className="flex justify-between mt-4">
              <Paragraph variant="large-semibold">Vendas em dinheiro:</Paragraph>
              <Paragraph>{formatMoney(cashierData.cashValue)}</Paragraph>
            </div>
            <div className="flex justify-between mt-4">
              <Paragraph variant="large-semibold">Vendas no crédito:</Paragraph>
              <Paragraph>{formatMoney(cashierData.creditCartValue)}</Paragraph>
            </div>
            <div className="flex justify-between mt-4">
              <Paragraph variant="large-semibold">Vendas no débito:</Paragraph>
              <Paragraph>{formatMoney(cashierData.debitCartValue)}</Paragraph>
            </div>
            <div className="flex justify-between mt-4">
              <Paragraph variant="large-semibold">Vendas no PIX:</Paragraph>
              <Paragraph>{formatMoney(cashierData.pixValue)}</Paragraph>
            </div>
            <div className="flex justify-between mt-4">
              <Paragraph variant="large-semibold">Total de vendas:</Paragraph>
              <Paragraph>{formatMoney(cashierData.totalOrders)}</Paragraph>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-sm py-xxs border-t">
          <Button variant="naked" color="default" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleClose} variant="primary">Fechar caixa</Button>
        </div>
      </div>
    </div>
  );
};
