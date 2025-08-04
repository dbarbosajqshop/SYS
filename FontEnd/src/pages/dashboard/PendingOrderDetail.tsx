import { ArrowBack } from "@/icons/ArrowBack";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useNavigate } from "react-router-dom";
import { IGetOrder } from "@/types/orders";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { formatMoney } from "@/helpers";
import { formatDate, setDefaultOptions } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Row } from "@/components/row";
import { Button } from "@/ui/Button";
import { EditableItemsTable } from "@/components/orders/editableItemsTable";
import { Column } from "@/components/column";
import { CatalogItems } from "@/components/catalogItems";
import { usePendingOrderDetails } from "@/hooks/usePendingOrderDetails";
import { cn } from "@/lib/utils";
import { IconButton } from "@/ui/IconButton";
import { Error } from "@/icons/Error";
import { Paragraph } from "@/ui/typography/Paragraph";
import { useProfile } from "@/hooks/useProfile";

setDefaultOptions({ locale: ptBR });

const OrderInfo = ({ orderData }: { orderData: IGetOrder }) => (
  <>
    <div className="flex flex-col  p-2 px-4 border-b sm:flex-row justify-between sm:items-center">
      <div>
        <Subtitle color="text-neutral-500" className="w-44">
          Pedido:
        </Subtitle>
        <Caption variant="large-semibold">#{orderData?.orderNumber || "N/A"}</Caption>
      </div>
      <div className="w-44">
        <Subtitle color="text-neutral-500">Vendedor:</Subtitle>
        <Caption variant="large-semibold">{orderData?.SellerId?.name}</Caption>
      </div>
      <div>
        <Subtitle color="text-neutral-500" className="w-44">
          Cliente:
        </Subtitle>
        <Caption variant="large-semibold">{orderData?.ClientId?.name}</Caption>
      </div>
      <div className="w-44">
        <Subtitle color="text-neutral-500">Data do pedido:</Subtitle>
        <Caption variant="large-semibold">
          {orderData?.dateOfOrder && formatDate(orderData?.dateOfOrder, "P")}
        </Caption>
      </div>
    </div>
    <div className="flex flex-col  p-2 px-4 border-b sm:flex-row justify-between sm:items-center">
      <div className="w-44">
        <Subtitle color="text-neutral-500">Quantidade de items:</Subtitle>
        <Caption variant="large-semibold" className="pl-1">
          {orderData?.itemsQuantity}
        </Caption>
      </div>
      <div className="w-44">
        <Subtitle color="text-neutral-500">Status:</Subtitle>
        <Caption variant="large-semibold">{orderData?.status?.toUpperCase()}</Caption>
      </div>
      <div className="w-44">
        <Subtitle color="text-neutral-500">Tipo de Envio:</Subtitle>
        <Caption variant="large-semibold">{orderData?.typeOfDelivery}</Caption>
      </div>
    </div>
    <div className="flex p-2 px-4 items-center justify-between gap-6">
      <div className="w-44">
        <Subtitle color="text-neutral-500">Método de Pagamento:</Subtitle>
        <Caption variant="large-semibold">
          {orderData?.ReceiptPayments?.length
            ? orderData.ReceiptPayments.map((payment) => payment.type)
            : "N/A"}
        </Caption>
      </div>
      <div className="w-44">
        <Subtitle color="text-neutral-500" className="w-44">
          Valor pago:
        </Subtitle>
        <Caption variant="large-semibold">{formatMoney(orderData?.totalPaid)}</Caption>
      </div>
      <div className="w-44">
        <Subtitle color="text-neutral-500">Valor total:</Subtitle>
        <Caption variant="large-semibold">{formatMoney(orderData?.totalPrice)}</Caption>
      </div>
    </div>
  </>
);

export default function PendingOrderDetail() {
  const navigate = useNavigate();

  const {
    handleAddItem,
    handleRemoveItem,
    handleSendToPayment,
    activeEditing,
    editOrder,
    onChangeItem,
    editOrderData,
    orderData,
    loading,
    editing,
    handleCancel,
  } = usePendingOrderDetails();

  const { authorize } = useProfile();

  if (loading && !editOrderData._id) return <SpinningLogo />;

  return (
    <Row className="p-xs sm:p-md relative sm:gap-4 overflow-x-hidden items-start justify-between  bg-neutral-100  ">
      <div className="flex flex-col gap-6 min-h-[50vh] w-full  p-sm border border-neutral-200 bg-neutral-0">
        <Row className="justify-between">
          <div
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowBack />
            <Caption color="text-neutral-500" variant="large">
              Voltar
            </Caption>
          </div>
          {authorize("w_pending_orders") && (
            <Row>
              {editing ? (
                <>
                  <Button
                    onClick={() => handleCancel()}
                    variant="outline"
                    color="destruct"
                  >
                    Cancelar
                  </Button>
                  <Button onClick={() => editOrder()} variant="primary">
                    Salvar Ajustes
                  </Button>
                </>
              ) : (
                <>
                  {!!editOrderData.totalPaid && (
                    <Button onClick={() => activeEditing()} variant="outline">
                      Ajustar Venda
                    </Button>
                  )}
                  <Button onClick={() => handleSendToPayment()} variant="primary">
                    Enviar para Pagamento
                  </Button>
                </>
              )}
            </Row>
          )}
        </Row>
        <Column className={cn("border sm:gap-0 relative")}>
          <Column
            className={cn(
              "absolute justify-center items-center w-full h-full backdrop-blur-sm     bg-white/90 ",
              editing ? "" : "opacity-0"
            )}
          >
            <IconButton variant="filled" size="large">
              <Error />
            </IconButton>
            <Subtitle variant="small" className="text-center">
              Ajustando Itens da venda
            </Subtitle>
            <Paragraph>
              Você deve terminar de editar os itens para verificar os detalhes do pedido.
            </Paragraph>
          </Column>
          {orderData && <OrderInfo orderData={orderData} />}
        </Column>
        <EditableItemsTable
          editing={editing}
          handleRemoveItem={handleRemoveItem}
          onChange={onChangeItem}
          items={editOrderData?.Items}
        />
      </div>
      <CatalogItems addItem={handleAddItem} editing={editing} />
    </Row>
  );
}
