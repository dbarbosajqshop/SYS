import { Caption } from "@/ui/typography/Caption";

type Props = {
  onEdit?: () => void; 
  onDelete?: () => void;
  onDetail?: () => void;
  onSeparation?: () => void;
  onReview?: () => void;
  onVoucher?: () => void;
  onDeliver?: () => void;
  onDock?: () => void;
  detailText?: string;
  onPaymentDetail?: () => void;
  editLabel?: string; 
};

export const TableDialog = ({
  onEdit,
  onDelete,
  onDetail,
  onSeparation,
  onReview,
  onVoucher,
  onDeliver,
  onDock,
  detailText,
  onPaymentDetail,
  editLabel, 
}: Props) => {
  return (
    <div className="absolute p-2 h-max w-max rounded-nano bg-neutral-0 border border-neutral-100">
      <div className="flex flex-col gap-2">
        {onSeparation && (
          <Caption
            onClick={onSeparation}
            variant="large"
            className="cursor-pointer"
          >
            Separar
          </Caption>
        )}
        {onPaymentDetail && (
          <Caption
            onClick={onPaymentDetail}
            variant="large"
            className="cursor-pointer"
          >
            Ir para pagamento
          </Caption>
        )}
        {onReview && (
          <Caption
            onClick={onReview}
            variant="large"
            className="cursor-pointer"
          >
            Conferir
          </Caption>
        )}
        {onVoucher && (
          <Caption
            onClick={onVoucher}
            variant="large"
            className="cursor-pointer"
          >
            Inserir voucher
          </Caption>
        )}
        {onDetail && (
          <Caption
            onClick={onDetail}
            variant="large"
            className="cursor-pointer"
          >
            {detailText || "Detalhes"}
          </Caption>
        )}
        {onEdit && (
          <Caption onClick={onEdit} variant="large" className="cursor-pointer">
            {editLabel || "Editar"} {/* Use editLabel aqui, com fallback para "Editar" */}
          </Caption>
        )}
        {onDock && (
          <Caption onClick={onDock} variant="large" className="cursor-pointer">
            Escolher doca
          </Caption>
        )}
        {onDeliver && (
          <Caption
            onClick={onDeliver}
            variant="large"
            className="cursor-pointer"
          >
            Entregar
          </Caption>
        )}
        {onDelete && (
          <Caption
            onClick={onDelete}
            variant="large"
            color="text-error-600"
            className="cursor-pointer"
          >
            Excluir
          </Caption>
        )}
      </div>
    </div>
  );
};