import { CloseCashierModal } from "@/components/CloseCashierModal";
import { OpenCashier } from "@/components/OpenCashier";
import { PaymentModal } from "@/components/PaymentModal";
import { ShipmentModal } from "@/components/ShipmentModal";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { DEFAULT_SHIPMENT_DATA } from "@/constants";
import { calculatePriceAndFormat, formatMoney, userRoles } from "@/helpers";
import { useCashier } from "@/hooks/useCashier";
import { useClients } from "@/hooks/useClients";
import { useCreateClient } from "@/hooks/useCreateClient";
import { useProfile } from "@/hooks/useProfile";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { Client } from "@/schemas/Client";
import { createCart, exportPdf, sellOrder, updateCart } from "@/services/carts";
import { searchCatalogy, getCatalogyById } from "@/services/catalogy";
import useCartStore from "@/store/cartStore";
import { Payment } from "@/types/carts";
import { ICartItem, IGetCatalogy } from "@/types/catalogy";
import { IPostClient, IPostShipment } from "@/types/client";
import { FormModal } from "@/ui/FormModal";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useDebounce } from "use-debounce";
import { getSelectedTax } from "@/services/taxes";
import { IGetTax } from "@/types/taxes";
import { useLocation, useNavigate } from "react-router-dom";
import { redirectWarning } from "@/helpers/messagesWarnings";
import { CartPanel } from "@/components/CartPanel";
import { StockPanel } from "@/components/StockPanel";
import { OrderLocalModal } from "@/components/OrderLocalModal";

export default function Sales() {
  const [cartId, setCartId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCatalogy, setLoadingCatalogy] = useState(false);
  const [clientId, setClientId] = useState<string>();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<IGetCatalogy[]>([]);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [openPaymentModal, setOpenPaymentModal] = useState(false);
  const [openCustomerModal, setOpenCustomerModal] = useState(false);
  const [clientData, setClientData] = useState<IPostClient>({} as IPostClient);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [openShipmentModal, setOpenShipmentModal] = useState(false);
  const [shipmentData, setShipmentData] = useState<IPostShipment>(DEFAULT_SHIPMENT_DATA);
  const [discountValue, setDiscountValue] = useState("");
  const [enabledDiscountEdit, setEnabledDiscountEdit] = useState(false);
  const [discount, setDiscount] = useState(Number);
  const [openCloseCashierModal, setOpenCloseCashierModal] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentOrder, setPaymentOrder] = useState(0);
  const [observation, setObservation] = useState<string>("");
  const [selectedTax, setSelectedTax] = useState<IGetTax>();
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [orderLocal, setOrderLocal] = useState<"online" | "presencial" | "">("");
  const [openOrderLocalModal, setOpenOrderLocalModal] = useState(false);
  const [canChooseOrderLocal, setCanChooseOrderLocal] = useState(false);

  const cartIdRef = useRef(cartId);
  const cartItemsRef = useRef(cartItems);
  const clientIdRef = useRef(clientId);
  const discountRef = useRef(discount);
  const paymentsRef = useRef(payments);
  const observationRef = useRef(observation);
  const shipmentDataRef = useRef(shipmentData);

  const [dSearch] = useDebounce(search, 500);

  const { profile, authorize, permissions } = useProfile();

  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { addClient } = useClients();

  useEffect(() => {
    shipmentDataRef.current = shipmentData;
  }, [shipmentData]);

  const { handleSubmit } = useCreateClient(
    clientData,
    setClientData,
    addClient,
    setErrors,
    setOpenCustomerModal,
    setClientId
  );

  useEffect(() => {
    if (!authorize("sidebar_pdv") && permissions?.length) {
      navigate("/profile");
      redirectWarning();
    }
  }, [pathname, permissions]);

  const handleOrderLocal = () => {
    const sellerOnline = permissions?.includes("w_seller_online");
    const sellerLocal = permissions?.includes("w_seller_local");

    if (sellerOnline && sellerLocal) {
      setCanChooseOrderLocal(true);
      return setOpenOrderLocalModal(true);
    }
    setCanChooseOrderLocal(false);
    if (sellerOnline) return setOrderLocal("online");
    if (sellerLocal) return setOrderLocal("presencial");
  };

  useEffect(() => {
    handleOrderLocal();
  }, [permissions]);

  const { setHandleCloseCart } = useCartStore();

  const handleCloseCashierModal = () => {
    fetchCashier();
    setOpenCloseCashierModal(true);
  };
  const { fetchCashier, cashier, loading: loadingCashier, open, close } = useCashier();

  const roles = userRoles(profile);

  useEffect(() => {
    const fetchTax = async () => {
      const response = await getSelectedTax();
      if (response.status === 200) setSelectedTax(response.data);
    };
    fetchTax();
  }, []);

  useEffect(() => {
    if (handleCloseCashierModal) setHandleCloseCart(handleCloseCashierModal);
  }, []);

  useEffect(() => {
    if (roles?.includes("seller_local"))
      return setShipmentData({ ...shipmentData, deliveryType: "Retirada" });
  }, [profile]);

  useEffect(() => {
    if (!enabledDiscountEdit && discountValue) {
      const newDiscountValue = discountValue.replace("R$ ", "").replace(",", ".");

      if (newDiscountValue) setDiscount(Number(newDiscountValue));
    }
  }, [enabledDiscountEdit]);

  const fetchCart = async () => {
    setLoading(true);
    const response = await createCart();
    if (response.status === 200 || response.status === 201) {
      setCartId(response.data._id);
      if (response.data.Items.length > 0) {
        setClientId(response.data.ClientId || undefined);
        setDiscount(response.data.discount || 0);
        setPayments(response.data.payments || []);
        setObservation(response.data.observation || "");
        if (response.data.typeOfDelivery) {
          setShipmentData((prevData) => ({
            ...prevData,
            deliveryType: response.data.typeOfDelivery,
            address: response.data.deliveryAddress || DEFAULT_SHIPMENT_DATA.address,
          }));
        }

        setCartItems([]);
        for (const item of response.data.Items) {
          const catalogyItem = await getCatalogyById(item.ItemId);
          if (!catalogyItem) continue;
          addItemToCart(catalogyItem as ICartItem, item.type, item.quantity);
        }
      }

      return setLoading(false);
    }
    return toast.error(response.data.error || response.data.message || "Erro interno do servidor", {
      theme: "colored",
    });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    cartIdRef.current = cartId;
    cartItemsRef.current = cartItems;
    clientIdRef.current = clientId;
    discountRef.current = discount;
    paymentsRef.current = payments;
    observationRef.current = observation;
  }, [cartId, cartItems, clientId, discount, payments, observation]);

  useEffect(() => {
    const fetchItems = async () => {
      if (orderLocal === "") return;
      setLoadingCatalogy(true);
      const response = await searchCatalogy({
        search: dSearch,
        page: currentPage,
        orderLocal,
      });

      if (response.status === 200) {
        const newItems = response.data.data;
        setSearchResults((prevResults) =>
          currentPage === 1 ? newItems : [...prevResults, ...newItems]
        );
        setHasMore(newItems?.length > 0);
      } else {
        setHasMore(false);
      }
      setLoadingCatalogy(false);
    };

    if (cartId) fetchItems();
  }, [dSearch, currentPage, cartId, orderLocal]);

  useEffect(() => {
    setCurrentPage(1);
    setSearchResults([]);
  }, [dSearch]);

  useEffect(() => {
    const sub = cartItems.reduce((acc, item) => {
      let itemTotal: number;

      if (item.isPromotion)
        // Usa o preço promocional se isPromotion for true
        itemTotal = item.promotionPrice;
      // Calcula o preço normalmente se não for promoção
      else
        itemTotal = calculatePriceAndFormat({
          price: item.price,
          quantity: item.quantity,
          quantityBox: item.quantityOfBox,
          tax: selectedTax,
          type: item.type,
          taxPrices: item.taxPrices,
          retailPrice: item.retailPrice,
          wholesalePrice: item.wholesalePrice,
        });

      const quantity =
        item.type === "unit" ? item.quantity : item.quantity * item.quantityOfBox;

      return acc + itemTotal * quantity;
    }, 0);

    setSubtotal(sub);
    const total = sub - discount;
    setTotal(total);
  }, [cartItems, discount, selectedTax]);

  function addItemToCart(item: ICartItem, type: "unit" | "box", quantity?: number): void {
    // Removido o bloqueio para caixa, só verifica estoque
    const availableUnits = item.totalUnits ?? 0;
    const availableBoxes = item.totalBoxes ?? 0;
    const addQuantity = quantity ?? 1;
    if ((type === 'unit' && addQuantity > availableUnits) || (type === 'box' && addQuantity > availableBoxes)) {
      toast.error(
        `Estoque insuficiente para o tipo selecionado. Disponível: ${type === 'unit' ? availableUnits : availableBoxes}`,
        { theme: 'colored' }
      );
      return;
    }
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(
        (cartItem) => cartItem.sku === item.sku && cartItem.type === type
      );
      // Se quantity não for informado, adiciona 1 (comportamento antigo)
      const newQuantity = existingItem
        ? existingItem.quantity + addQuantity
        : addQuantity;
      let unitPrice: number;
      if (item.isPromotion) {
        if (item.type === "box") unitPrice = item.promotionPrice * item.quantityOfBox;
        else unitPrice = item.promotionPrice;
      } else {
        if (item.type === "box") unitPrice = item.price * item.quantityOfBox;
        else
          unitPrice = calculatePriceAndFormat({
            price: item.price,
            quantity: newQuantity,
            quantityBox: item.quantityOfBox,
            type,
            tax: selectedTax,
            taxPrices: item.taxPrices,
            retailPrice: item.retailPrice,
            wholesalePrice: item.wholesalePrice,
          });
      }
      if (existingItem) {
        return prevItems.map((cartItem) =>
          cartItem.sku === item.sku && cartItem.type === type
            ? {
                ...cartItem,
                quantity: newQuantity,
                unitPrice,
                totalPrice: newQuantity * unitPrice,
              }
            : cartItem
        );
      }
      return [
        ...prevItems,
        {
          ...item,
          type,
          quantity: addQuantity,
          unitPrice,
          totalPrice: addQuantity * unitPrice,
        },
      ];
    });
    toast.success(`Adicionado: ${item.name} (${type === "box" ? "Caixa" : "Unidade"})`);
  }

  const handleEditItemQuantity = (
    sku: string,
    type: "unit" | "box",
    quantity: string
  ) => {
    if (!isNaN(Number(quantity))) {
      const newQuantity = Number(quantity);

      if (newQuantity === 0) {
        setCartItems(
          cartItems.filter(
            (cartItem) => !(cartItem.sku === sku && cartItem.type === type)
          )
        );
        return;
      }

      setCartItems(
        cartItems.map((cartItem) => {
          if (cartItem.sku === sku && cartItem.type === type) {
            let unitPrice: number;

            if (cartItem.isPromotion) {
              // Usa o preço promocional se isPromotion for true
              if (type === "box")
                unitPrice = cartItem.promotionPrice * cartItem.quantityOfBox;
              else unitPrice = cartItem.promotionPrice;
            }
            // Calcula o preço normalmente se não for promoção
            else if (type === "box")
              // Para "box", o preço unitário é o preço do item multiplicado pela quantidade na caixa
              unitPrice = cartItem.price * cartItem.quantityOfBox;
            else
              unitPrice = calculatePriceAndFormat({
                price: cartItem.price,
                quantity: newQuantity,
                quantityBox: cartItem.quantityOfBox,
                type,
                tax: selectedTax,
                taxPrices: cartItem.taxPrices,
                retailPrice: cartItem.retailPrice,
                wholesalePrice: cartItem.wholesalePrice,
              });

            return {
              ...cartItem,
              quantity: newQuantity,
              unitPrice: unitPrice, // Atualiza o preço unitário
              totalPrice: newQuantity * unitPrice, // Recalcula o preço total
            };
          }
          return cartItem;
        })
      );
    }
  };

  const makeOrderDataFromRefs = () => {
    const cartItemsList = cartItemsRef.current.map((item) => ({
      ItemId: item.ItemId,
      quantity: item.quantity || 1,
      type: item.type,
    }));
    return {
      Items: cartItemsList,
      ClientId: clientIdRef.current || undefined,
      SellerId: profile._id,
      itemsQuantity: cartItemsRef.current.length,
      totalQuantity: cartItemsRef.current.reduce(
        (acc, item) => acc + (item.quantity || 1),
        0
      ),
      discount: discountRef.current,
      observation: observationRef.current,
      payments: paymentsRef.current,
      local: orderLocal,
      typeOfDelivery:
        shipmentDataRef.current?.deliveryType.toLocaleLowerCase() || "retirada",
      deliveryAddress: shipmentDataRef.current?.address,
    };
  };

  const handleSaveCart = async () => {
    setLoading(true);

    const data = makeOrderDataFromRefs();

    const response = await sellOrder(cartId, data);
    if (response.status === 200) {
      setCartItems([]);
      setClientId(undefined);
      setShipmentData(DEFAULT_SHIPMENT_DATA);
      setPayments([]);
      setPaymentOrder(0);
      setLoading(false);
      setObservation("");

      fetchCart();

      const pdfData = await exportPdf(response.data);

      if (pdfData.status === 200) {
        const blob = new Blob([pdfData.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = url;

        document.body.appendChild(iframe);

        iframe.onload = () => {
          iframe.contentWindow?.print();
        };
      }

      return toast.success("Venda efetuada", { theme: "colored" });
    }

    setLoading(false);
    toast.error(response.data.error || response.data.message || "Erro interno do servidor", {
      theme: "colored",
    });
  };

  // salvar carrinho ao sair da página
  useEffect(() => {
    return () => {
      if (cartIdRef.current) {
        const data = makeOrderDataFromRefs();
        (async () => {
          try {
            await updateCart(cartIdRef.current, data);
            toast.info("Carrinho salvo", { theme: "colored" });
          } catch (e) {
            toast.error("Erro ao salvar carrinho: " + e, { theme: "colored" });
          }
        })();
      }
    };
  }, []);

  const handlePaymentText = () => {
    if (payments.length === 0) return "Adicionar pagamento";
    const totalPaid = payments.reduce((acc, payment) => acc + payment.amount, 0);
    if (totalPaid === total) return "Pagamento completo";
    return `Valor pago: ${formatMoney(totalPaid)}`;
  };

  const hasOutOfStockItems = cartItems.some((item) =>
    item.type === "unit"
      ? item.quantity > item.totalUnits
      : item.quantity > item.totalBoxes
  );

  if (loadingCashier) return <SpinningLogo />;

  if (roles?.includes("seller_local") && !cashier) return <OpenCashier open={open} />;

  return (
    <div className="flex-col sm:flex-row bg-neutral-50 flex justify-stretch p-md h-max">
      <PaymentModal
        open={openPaymentModal}
        setOpen={setOpenPaymentModal}
        setPayments={setPayments}
        total={total}
        paymentOrder={paymentOrder}
        setPaymentOrder={setPaymentOrder}
      />
      <FormModal
        entity="Cliente"
        mode="Criar"
        open={openCustomerModal}
        setOpen={setOpenCustomerModal}
        onSubmit={handleSubmit}
      >
        <Client clientData={clientData} setClientData={setClientData} erros={errors} />
      </FormModal>
      <ShipmentModal
        open={openShipmentModal}
        setOpen={setOpenShipmentModal}
        shipmentData={shipmentData}
        setShipmentData={setShipmentData}
        clientId={clientId}
      />
      {roles?.includes("seller_local") && cashier && (
        <CloseCashierModal
          open={openCloseCashierModal}
          setOpen={setOpenCloseCashierModal}
          cashierData={cashier}
          onClose={close}
        />
      )}
      <OrderLocalModal
        open={openOrderLocalModal}
        setOpen={setOpenOrderLocalModal}
        setOrderLocal={setOrderLocal}
      />
      <div className="hidden sm:block w-full">
        <ResizablePanelGroup className="h-max" direction="horizontal">
          <ResizablePanel minSize={35} defaultSize={45}>
            <CartPanel
              profile={profile}
              selectedTax={selectedTax}
              cartItems={cartItems}
              setCartItems={setCartItems}
              clientId={clientId}
              setClientId={setClientId}
              setPayments={setPayments}
              subtotal={subtotal}
              total={total}
              discountValue={discountValue}
              setDiscountValue={setDiscountValue}
              enabledDiscountEdit={enabledDiscountEdit}
              setEnabledDiscountEdit={setEnabledDiscountEdit}
              observation={observation}
              setObservation={setObservation}
              handleEditItemQuantity={handleEditItemQuantity}
              handlePaymentText={handlePaymentText}
              handleSaveCart={handleSaveCart}
              hasOutOfStockItems={hasOutOfStockItems}
              setOpenPaymentModal={setOpenPaymentModal}
              loading={loading}
              setDiscount={setDiscount}
              setOpenCustomerModal={setOpenCustomerModal}
              setOpenShipmentModal={setOpenShipmentModal}
              setShipmentData={setShipmentData}
              shipmentData={shipmentData}
            />
          </ResizablePanel>

          <ResizableHandle withHandle />
          <ResizablePanel minSize={25}>
            <StockPanel
              search={search}
              setSearch={setSearch}
              searchResults={searchResults}
              addItemToCart={addItemToCart}
              loadingCatalogy={loadingCatalogy}
              hasMore={hasMore}
              setCurrentPage={setCurrentPage}
              orderLocal={orderLocal}
              setOpenOrderLocalModal={setOpenOrderLocalModal}
              canChooseOrderLocal={canChooseOrderLocal}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>

      <div className="sm:hidden">
        <CartPanel
          profile={profile}
          selectedTax={selectedTax}
          cartItems={cartItems}
          setCartItems={setCartItems}
          clientId={clientId}
          setClientId={setClientId}
          setPayments={setPayments}
          subtotal={subtotal}
          total={total}
          discountValue={discountValue}
          setDiscountValue={setDiscountValue}
          enabledDiscountEdit={enabledDiscountEdit}
          setEnabledDiscountEdit={setEnabledDiscountEdit}
          observation={observation}
          setObservation={setObservation}
          handleEditItemQuantity={handleEditItemQuantity}
          handlePaymentText={handlePaymentText}
          handleSaveCart={handleSaveCart}
          hasOutOfStockItems={hasOutOfStockItems}
          setOpenPaymentModal={setOpenPaymentModal}
          loading={loading}
          setDiscount={setDiscount}
          setOpenCustomerModal={setOpenCustomerModal}
          setOpenShipmentModal={setOpenShipmentModal}
          setShipmentData={setShipmentData}
          shipmentData={shipmentData}
        />
        <StockPanel
          search={search}
          setSearch={setSearch}
          searchResults={searchResults}
          addItemToCart={addItemToCart}
          loadingCatalogy={loadingCatalogy}
          hasMore={hasMore}
          setCurrentPage={setCurrentPage}
          orderLocal={orderLocal}
          setOpenOrderLocalModal={setOpenOrderLocalModal}
          canChooseOrderLocal={canChooseOrderLocal}
        />
      </div>
    </div>
  );
}
