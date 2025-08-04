import { ArrowBack } from "@/icons/ArrowBack";
import { Caption } from "@/ui/typography/Caption";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";
import { IGetOrder } from "@/types/orders";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { Table } from "@/ui/Table";
import { formatDateTime, formatMoney } from "@/helpers";
import { useProfile } from "@/hooks/useProfile";
import { redirectWarning } from "@/helpers/messagesWarnings";
import { Button } from "@/ui/Button";
import { taxCouponPdf, printBoxLabel } from "@/services/orders";
import { toast } from "react-toastify";
import { IGetClient } from "@/types/client";
import { ViewModal } from "@/ui/Modal";
import { QuantityModal } from "@/components/QuantityModal";

export default function OrderDetail() {
  const [orderData, setOrderData] = useState<IGetOrder | undefined>();
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [openQuantityModal, setOpenQuantityModal] = useState(false);
  const [quantity, setQuantity] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const { authorize, permissions } = useProfile();
  const { fetchOrder, loading } = useOrders("all");

  const fetchOrderData = async () => {
    try {
      const purchase: IGetOrder | undefined = await fetchOrder(
        location.pathname.split("/")[2]
      );
      setOrderData(purchase);
    } catch {
      toast.error("Erro ao carregar dados do pedido");
    }
  };

  const handleOpenClientModal = () => {
    if (!orderData?.ClientId) return toast.warning("Cliente não encontrado neste pedido");

    setIsClientModalOpen(true);
  };

  const printOrder = async () => {
    try {
      if (!orderData?._id) return;

      const response = await taxCouponPdf(orderData._id);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const printWindow = window.open(url, "_blank");

      if (printWindow)
        printWindow.onload = () => {
          printWindow.print();
        };
    } catch (error) {
      toast.error((error as Error).message);
      toast.error("Erro ao exibir o pedido");
    }
  };

  const printLabel = async (quantity: number) => {
    try {
      if (!orderData?._id) return;
      if (orderData?.status !== "docas") return;

      const response = await printBoxLabel(orderData._id, document.URL, quantity);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const printWindow = window.open(url, "_blank");

      if (printWindow)
        printWindow.onload = () => {
          printWindow.print();
        };
    } catch (error) {
      toast.error((error as Error).message);
      toast.error("Erro ao exibir a etiqueta");
    }
  };

  useEffect(() => {
    fetchOrderData();
  }, [location.pathname]);

  useEffect(() => {
    if (permissions.length > 0 && !authorize("r_orders")) {
      navigate("/profile");
      redirectWarning();
    }
  }, [permissions]);

  if (loading || !orderData) return <SpinningLogo />;

  const clientData = orderData.ClientId as IGetClient | undefined;

  const formatOrderType = (type: string | undefined) => {
    if (type === "presencial") return "Presencial";
    if (type === "online") return "Online";
    return "N/A";
  };

  return (
    <div className="p-sm sm:px-md bg-neutral-100 h-max">
      <div className="flex flex-col gap-6 p-sm border border-neutral-200 bg-neutral-0">
        <ViewModal
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
          title="Informações do Cliente"
        >
          {clientData ? (
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-neutral-500 text-sm">Nome:</label>
                <input
                  type="text"
                  value={clientData.name}
                  disabled
                  className="bg-neutral-100 border border-neutral-200 rounded-sm p-2 text-neutral-800 disabled:opacity-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-neutral-500 text-sm">CPF/CNPJ:</label>
                <input
                  type="text"
                  value={clientData.cpf || clientData.cnpj || "N/A"}
                  disabled
                  className="bg-neutral-100 border border-neutral-200 rounded-sm p-2 text-neutral-800 disabled:opacity-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-neutral-500 text-sm">Telefone:</label>
                <input
                  type="text"
                  value={clientData.telephoneNumber || "N/A"}
                  disabled
                  className="bg-neutral-100 border border-neutral-200 rounded-sm p-2 text-neutral-800 disabled:opacity-100"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-neutral-500 text-sm">E-mail:</label>
                <input
                  type="text"
                  value={clientData.email || "N/A"}
                  disabled
                  className="bg-neutral-100 border border-neutral-200 rounded-sm p-2 text-neutral-800 disabled:opacity-100"
                />
              </div>

              {clientData.address && (
                <div className="flex flex-col gap-1">
                  <label className="text-neutral-500 text-sm">Endereço:</label>
                  <textarea
                    value={`${clientData.address.street}, ${clientData.address.number}${
                      clientData.address.complement
                        ? `, ${clientData.address.complement}`
                        : ""
                    }\n${clientData.address.neighborhood}\n${clientData.address.city} - ${
                      clientData.address.state
                    }\nCEP: ${clientData.address.zip}`}
                    disabled
                    rows={4}
                    className="bg-neutral-100 border border-neutral-200 rounded-sm p-2 text-neutral-800 disabled:opacity-100"
                  />
                </div>
              )}
            </div>
          ) : (
            <Paragraph>Não foi possível carregar os dados do cliente</Paragraph>
          )}
        </ViewModal>
        <QuantityModal
          title="Digite a quantidade de etiquetas"
          quantity={quantity}
          open={openQuantityModal}
          setOpen={setOpenQuantityModal}
          setQuantity={setQuantity}
          onConfirm={() => {
            printLabel(Number(quantity));
            setOpenQuantityModal(false);
            setQuantity("");
          }}
        />

        <div className="flex justify-between items-center">
          <div
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowBack />
            <Caption color="text-neutral-500" variant="large">
              Voltar
            </Caption>
          </div>
          <div className="flex gap-2">
            {orderData?.status === "docas" && (
              <Button onClick={() => setOpenQuantityModal(true)}>
                Imprimir etiqueta
              </Button>
            )}
            <Button onClick={printOrder}>Imprimir venda</Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div>
            <Paragraph color="text-neutral-500">Pedido:</Paragraph>
            <Subtitle variant="large">#{orderData?.orderNumber || "N/A"}</Subtitle>
          </div>
          <div>
            <Paragraph color="text-neutral-500">Data do pedido:</Paragraph>
            <Subtitle variant="large">{formatDateTime(orderData?.dateOfOrder)}</Subtitle>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="w-full sm:w-auto">
            <Paragraph color="text-neutral-500">Vendedor:</Paragraph>
            <Subtitle variant="large">{orderData?.SellerId?.name}</Subtitle>
          </div>
          <div className="w-full sm:w-auto">
            <Paragraph color="text-neutral-500">Cliente:</Paragraph>
            <Subtitle
              variant="large"
              className="cursor-pointer hover:underline flex items-center gap-2"
              onClick={handleOpenClientModal}
            >
              {orderData?.ClientId?.name}
            </Subtitle>
          </div>
          <div className="w-full sm:w-auto">
            <Paragraph color="text-neutral-500">Status:</Paragraph>
            <Subtitle variant="large">{orderData?.status?.toUpperCase()}</Subtitle>
          </div>
          <div className="w-full sm:w-auto">
            <Paragraph color="text-neutral-500">Tipo de Pedido:</Paragraph>
            <Subtitle variant="large">{formatOrderType(orderData?.local)}</Subtitle>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="w-full sm:w-auto">
            <Paragraph color="text-neutral-500">Quantidade de items:</Paragraph>
            <Subtitle variant="large">{orderData?.itemsQuantity}</Subtitle>
          </div>
          <div className="w-full sm:w-auto">
            <Paragraph color="text-neutral-500">Valor pago:</Paragraph>
            <Subtitle variant="large">{formatMoney(orderData?.totalPaid)}</Subtitle>
          </div>
          <div className="w-full sm:w-auto">
            <Paragraph color="text-neutral-500">Valor total:</Paragraph>
            <Subtitle variant="large">{formatMoney(orderData?.totalPrice)}</Subtitle>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {orderData?.observation && (
            <div className="w-full sm:w-auto">
              <Paragraph color="text-neutral-500">Observação:</Paragraph>
              <Subtitle variant="large">{orderData?.observation}</Subtitle>
            </div>
          )}
        </div>

        {orderData?.deliveryAddress && (
          <div className="w-full sm:w-auto">
            <Paragraph color="text-neutral-500">Endereço de Entrega:</Paragraph>
            <Subtitle variant="large">
              {orderData.deliveryAddress.street}, {orderData.deliveryAddress.number}
              {orderData.deliveryAddress.complement
                ? `, ${orderData.deliveryAddress.complement}`
                : ""}
              <br />
              {orderData.deliveryAddress.neighborhood}, {orderData.deliveryAddress.city} -{" "}
              {orderData.deliveryAddress.state}
              <br />
              CEP: {orderData.deliveryAddress.zip}
            </Subtitle>
          </div>
        )}

        {orderData?.deliveryAddress && (
          <div className="w-full sm:w-auto">
            <Paragraph color="text-neutral-500">Endereço de Entrega:</Paragraph>
            <Subtitle variant="large">
              {orderData.deliveryAddress.street}, {orderData.deliveryAddress.number}
              {orderData.deliveryAddress.complement ? `, ${orderData.deliveryAddress.complement}` : ''}
              <br />
              {orderData.deliveryAddress.neighborhood}, {orderData.deliveryAddress.city} - {orderData.deliveryAddress.state}
              <br />
              CEP: {orderData.deliveryAddress.zip}
            </Subtitle>
          </div>
        )}

        <div className="w-full overflow-x-auto">
          <div className="max-h-[400px] overflow-y-auto">
            <Table
              data={orderData?.Items}
              imageField="imageUrl"
              headers={[
                { label: "Item", key: "ItemId.name" },
                { label: "Valor unitário", key: "itemUnitPrice" },
                { label: "Valor total", key: "itemTotalPrice" },
                { label: "Tipo", key: "type" },
                { label: "Quantidade", key: "quantity" },
              ]}
              customMappings={{
                type: {
                  box: "Caixa",
                  unit: "Unidade",
                },
              }}
              monetaryFields={["itemUnitPrice", "itemTotalPrice"]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
