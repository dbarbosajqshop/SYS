import React from "react";
import { CartButton } from "./CartButton";
import { DEFAULT_SHIPMENT_DATA } from "@/constants";
import { formatMoney, formatCurrencyText, userRoles } from "@/helpers";
import { LocalShipping } from "@/icons/LocalShipping";
import { PersonAdd } from "@/icons/PersonAdd";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { ClientAutoComplete } from "@/pages/report/components/clientAutoComplete";
import { IconButton } from "@/ui/IconButton";
import { Td } from "@/ui/Td";
import { Th } from "@/ui/Th";
import { Thead } from "@/ui/Thead";
import { Caption } from "@/ui/typography/Caption";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Column } from "./column";
import { SaleDiscountModal } from "./SaleDiscountModal";
import { Textarea } from "./ui/textarea";
import { Close } from "@/icons/Close";
import { User } from "lucide-react";
import { Error } from "@/icons/Error";
import { Input } from "@/ui/Input";
import { Row } from "./row";
import { Button } from "@/ui/Button";
import { CreditCard } from "@/icons/CreditCard";
import { Check } from "@/icons/Check";
import { IGetUser } from "@/types/user";
import { IGetTax } from "@/types/taxes";
import { ICartItem } from "@/types/catalogy";
import { Edit } from "@/icons/Edit";
import { IPostShipment } from "@/types/client";
import { Payment } from "@/types/carts";

type Props = {
  profile: IGetUser;
  selectedTax?: IGetTax;
  cartItems: ICartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<ICartItem[]>>;
  handleEditItemQuantity: (sku: string, type: "unit" | "box", quantity: string) => void;
  loading: boolean;
  enabledDiscountEdit: boolean;
  setEnabledDiscountEdit: React.Dispatch<React.SetStateAction<boolean>>;
  discountValue: string;
  setDiscountValue: React.Dispatch<React.SetStateAction<string>>;
  subtotal: number;
  total: number;
  setOpenPaymentModal: (open: boolean) => void;
  handlePaymentText: () => string;
  clientId?: string;
  setClientId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setOpenCustomerModal: (open: boolean) => void;
  setOpenShipmentModal: (open: boolean) => void;
  shipmentData: IPostShipment;
  setShipmentData: React.Dispatch<React.SetStateAction<IPostShipment>>;
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
  setDiscount: React.Dispatch<React.SetStateAction<number>>;
  handleSaveCart: () => void;
  hasOutOfStockItems: boolean;
  observation: string;
  setObservation: React.Dispatch<React.SetStateAction<string>>;
};

export const CartPanel = ({
  profile,
  selectedTax,
  cartItems,
  handleEditItemQuantity,
  setCartItems,
  loading,
  enabledDiscountEdit,
  setEnabledDiscountEdit,
  discountValue,
  setDiscountValue,
  subtotal,
  total,
  setOpenPaymentModal,
  handlePaymentText,
  clientId,
  setClientId,
  setOpenCustomerModal,
  setOpenShipmentModal,
  shipmentData,
  setShipmentData,
  setPayments,
  setDiscount,
  handleSaveCart,
  hasOutOfStockItems,
  observation,
  setObservation,
}: Props) => {
  return (
    <div className="bg-neutral-0">
      <div className="flex flex-col p-sm border border-neutral-200">
        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
          <Subtitle variant="large">Carrinho</Subtitle>
          <div className="flex w-auto  bg-neutral-50 py-1.5 px-4 rounded-full items-center gap-1 flex-wrap sm:flex-nowrap">
            <User className="text-[#1567E2]" />
            <Caption variant="small-semibold">{` ${profile.name}`}</Caption>
          </div>
        </div>
        <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
          <Subtitle variant="large">Taxas atuais:</Subtitle>
          <div className="flex py-1.5 self-end items-center gap-1 flex-wrap sm:flex-nowrap">
            <Caption variant="large">Varejo:</Caption>
            <Paragraph>{selectedTax?.retailTaxPercentage}%</Paragraph>
            <Caption variant="large">Atacado:</Caption>
            <Paragraph>{selectedTax?.wholesaleTaxPercentage}%</Paragraph>
          </div>
        </div>
      </div>
      <div className="border">
        {cartItems.length === 0 && (
          <div className="flex flex-col items-center justify-center w-full my-md">
            <IconButton variant="filled" size="large">
              <Error />
            </IconButton>
            <Subtitle variant="small" className="text-center">
              Você ainda não adicionou nenhum item a esse carrinho
            </Subtitle>
            <Paragraph>
              Adicione itens a esse carrinho para fazer uma nova venda
            </Paragraph>
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="max-w-[330px] max-h-[34vh] sm:max-w-full overflow-x-auto">
            <table className="w-full h-full overflow-y-auto">
              <Thead>
                <Th>Produto</Th>
                <Th>Preço</Th>
                <Th>Qtd.</Th>
                <Th>Valor final</Th>
                <Th align="right">{""}</Th>
              </Thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr
                    key={`${item.sku}-${item.type}`}
                    className={`h-12 border ${
                      (item.type === "box" && item.quantity > item.totalBoxes) ||
                      (item.type === "unit" && item.quantity > item.totalUnits)
                        ? "border-error-600 bg-error-100"
                        : "border-neutral-200"
                    }`}
                  >
                    <Td>
                      <Caption className="text-nowrap">
                        {item.name.length > 40
                          ? item.name.slice(0, 40) + "..."
                          : item.name}
                      </Caption>
                      <Caption variant="large-semibold" className="text-nowrap">
                        {item.type === "box" ? "Caixa" : "Unidade"}
                      </Caption>
                      <Caption className="text-nowrap" variant="large-semibold">
                        {`Caixa fechada: ${item.quantityOfBox}`}
                      </Caption>
                    </Td>
                    <Td>{formatMoney(item.unitPrice)}</Td>
                    <Td>
                      <Input
                        className="w-12 max-h-10 -my-2"
                        data={item.quantity?.toString() || "1"}
                        onChange={(e) =>
                          handleEditItemQuantity(item.sku, item.type, e.target.value)
                        }
                      />
                      {((item.type === "box" && item.quantity > item.totalBoxes) ||
                        (item.type === "unit" && item.quantity > item.totalUnits)) && (
                        <Paragraph
                          variant="large-semibold"
                          color="text-error-600"
                          className="text-nowrap"
                        >
                          Sem estoque!
                        </Paragraph>
                      )}
                    </Td>
                    <Td>{formatMoney(item.totalPrice)}</Td>
                    <Td align="right">
                      <Close
                        onClick={() =>
                          setCartItems(
                            cartItems.filter(
                              (cartItem) =>
                                !(
                                  cartItem.sku === item.sku && cartItem.type === item.type
                                )
                            )
                          )
                        }
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {loading && <SpinningLogo />}
        {!loading && cartItems.length > 0 && (
          <>
            <div>
              <div className="flex flex-wrap sm:flex-nowrap items-center bg-neutral-50 h-9">
                <div className="flex items-center justify-between w-1/2 py-nano px-xxs">
                  <Caption variant="large-semibold">Produtos:</Caption>
                  <Caption variant="large">{cartItems.length}</Caption>
                </div>
                <div className="flex items-center justify-between w-1/2 py-nano px-xxs">
                  <Caption variant="large-semibold">Quantidade:</Caption>
                  <Caption variant="large">
                    {cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)}
                  </Caption>
                </div>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center bg-neutral-50 h-auto">
                <div className="flex items-center gap-2 justify-between w-1/2 py-nano px-xxs">
                  <Row className="">
                    <SaleDiscountModal
                      onSuccess={() => {
                        setEnabledDiscountEdit(true);
                      }}
                    >
                      {!enabledDiscountEdit && (
                        <div className="cursor-pointer hover:bg-gray-400/30 transition-all  p-2 rounded-full bg-transparent">
                          <Edit color="#0A0A0A" height={16} width={16} />{" "}
                        </div>
                      )}
                    </SaleDiscountModal>
                    <Caption variant="large">Desconto:</Caption>
                  </Row>
                  {!enabledDiscountEdit ? (
                    <Caption variant="large">
                      {formatCurrencyText(discountValue || "0000")}
                    </Caption>
                  ) : (
                    <Row className="gap-2">
                      <Input
                        wide
                        className=" -my-5 max-h-10 text-sm bg-neutral-0"
                        placeholder="R$ 00,00"
                        data={discountValue}
                        onChange={(e) =>
                          setDiscountValue(formatCurrencyText(e.target.value))
                        }
                      />
                      <Button
                        onClick={() => {
                          setEnabledDiscountEdit(false);
                        }}
                        className="text-white max-h-10 text-xs"
                        variant="primary"
                      >
                        <b>Salvar</b>
                      </Button>
                    </Row>
                  )}
                </div>
                <div className="flex items-center justify-between w-1/2 py-nano px-xxs">
                  <Caption variant="large-semibold">Subtotal:</Caption>
                  <Caption variant="large">{formatMoney(subtotal)}</Caption>
                </div>
              </div>

              <div className="flex items-center justify-between w-full py-nano px-xxs bg-neutral-950 h-9">
                <Caption variant="large-semibold" color="text-neutral-0">
                  Total:
                </Caption>
                <Caption variant="large" color="text-neutral-0">
                  {formatMoney(total)}
                </Caption>
              </div>
            </div>

            <div className="flex flex-col gap-2 py-4 px-6">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <CartButton
                  onClick={() => setOpenPaymentModal(true)}
                  text={handlePaymentText()}
                  icon={<CreditCard />}
                  color="#0284C7"
                  className="sm:w-[50%]"
                />
                <Row className="sm:w-[50%]  sm:gap-0">
                  <ClientAutoComplete
                    className="rounded-r-none w-full h-10"
                    handleSetFilter={setClientId}
                    selectedValue={clientId || ""}
                  />
                  <CartButton
                    className="max-w-20 rounded-l-none"
                    onClick={() => setOpenCustomerModal(true)}
                    icon={<PersonAdd />}
                    color="#1567E2"
                  />
                </Row>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                <CartButton
                  onClick={
                    userRoles(profile)?.includes("seller_local")
                      ? undefined
                      : () => setOpenShipmentModal(true)
                  }
                  text={shipmentData.deliveryType || "Adicionar frete"}
                  icon={<LocalShipping />}
                  color="#D97706"
                />
                <CartButton
                  onClick={() => {
                    setCartItems([]);
                    setClientId(undefined);
                    setPayments([]);
                    setDiscount(0);
                    setShipmentData(DEFAULT_SHIPMENT_DATA);
                  }}
                  text="Cancelar venda"
                  icon={<Close />}
                  color="#DC2626"
                />
              </div>
              <CartButton
                onClick={handleSaveCart}
                className="-order-1 sm:order-1"
                text="Finalizar venda"
                icon={<Check />}
                color="#16A34A"
                disabled={hasOutOfStockItems}
              />
            </div>
          </>
        )}
      </div>
      {!loading && cartItems.length > 0 && (
        <Column className="p-3 border bg-neutral-50 border-t-0">
          <Caption variant="large">Deseja adicionar uma observação?</Caption>
          <Textarea
            onChange={({ target }) => setObservation(target.value)}
            value={observation}
            className="resize-none max-h-12 bg-white"
          />
        </Column>
      )}
    </div>
  );
};
