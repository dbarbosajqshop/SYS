import { IGetOrder, OrderItem } from "@/types/orders";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useOrders } from "./useOrders";
import { useQuery } from "@tanstack/react-query";
import { IGetCatalogy } from "@/types/catalogy";
import { adjustPendingOrder, confirmPendindOrder } from "@/services/orders";
import useLoadingStore from "@/store/loadingStore";
import { toast } from "react-toastify";

export const usePendingOrderDetails = () => {
  const [editOrderData, setEditOrderData] = useState<IGetOrder>({} as IGetOrder);
  const [editing, setEditing] = useState(false);

  const { id } = useParams();
  const { setIsLoading } = useLoadingStore();
  const navigate = useNavigate();

  const { fetchOrder, loading } = useOrders("all");

  const onChangeItem = (index: number, key: string, value: string | number) => {
    if (!orderData?.Items.length) return;

    const newItems = editOrderData.Items.map((item, i) =>
      i === index ? { ...item, [key]: value } : item
    );

    setEditOrderData((prev) => ({
      ...prev,
      totalPrice: validateValue(newItems),
      Items: newItems,
    }));
  };

  const { data: orderData, refetch } = useQuery({
    queryKey: ["orderById", id],
    enabled: !!id,
    refetchOnWindowFocus: false,
    queryFn: () => fetchOrder(id || ""),
  });

  useEffect(() => {
    if (orderData) {
      setEditOrderData(orderData);
    }
  }, [orderData]);

  const validateValue = (toValidateItems: OrderItem[]) => {
    const totalValue = toValidateItems.reduce((acc, item) => {
      return acc + item.ItemId.price * item.quantity;
    }, 0);
    return totalValue;
  };

  const handleAddItem = (item: IGetCatalogy, type: "unit" | "box") => {
    const items = editOrderData.Items;
    // Busca item pelo id e tipo
    const existedItem = items?.find((i) => i._id === item.ItemId && i.type === type);

    const boxMultiplier = item.quantityBox || item.quantityOfBox || 1;
    const price = type === "box"
      ? item.price * boxMultiplier
      : item.price;

    if (existedItem) {
      const newItems = items.map((i) => {
        if (i._id === item.ItemId && i.type === type) {
          return { ...i, quantity: i.quantity + 1 };
        }
        return i;
      });
      setEditOrderData((prev) => ({ ...prev, Items: newItems }));
      return;
    }

    const newItems = [
      ...items,
      {
        ItemId: {
          name: item.name,
          sku: item.sku,
          price: item.price,
          _id: item.ItemId,
        },
        imageUrl: item.imageUrl || null,
        _id: item.ItemId,
        quantity: 1,
        type, // Usa o tipo passado
        price, 
        quantityBox: boxMultiplier, 
      },
    ];
    setEditOrderData((prev) => ({
      ...prev,
      Items: newItems as OrderItem[],
      totalPrice: validateValue(newItems as OrderItem[]),
      itemsQuantity: newItems?.length || 0,
    }));
  };

  const handleSendToPayment = async () => {
    try {
      setIsLoading(true);
      const response = await confirmPendindOrder(editOrderData._id);
      setIsLoading(false);

    if (response) {
      toast.success("Pedido enviado para pagamento", { theme: "colored" });
      setTimeout(() => {
        navigate("/dashboard/pending");
      }, 2000);
      }
    } catch (error) {
      toast.error("Erro ao enviar pedido para pagamento", { theme: "colored" });
    }
  };

  const handleSendToSeparation = async () => {
    setIsLoading(true);
    const response = await confirmPendindOrder(editOrderData._id);

    setIsLoading(false);

    if (response) {
      toast.success("Pedido enviado para separação", { theme: "colored" });
      setTimeout(() => {
        navigate("/dashboard/pending");
      }, 2000);
    }
  };

  const activeEditing = () => {
    setEditing(true);
  };

  const editOrder = async () => {
    try {
      console.log("editOrderData", editOrderData);
      setIsLoading(true);
      
      const itemsToSend = editOrderData.Items.map(item => ({
        ItemId: item.ItemId._id,
        quantity: item.quantity,
        type: item.type || "unit"
      }));
      
      const response = await adjustPendingOrder(editOrderData._id, itemsToSend);
      
      if (response.status !== 200) {
        const errorMessage = response.data?.message || response.data?.error || "Erro ao editar o pedido";
        throw new Error(errorMessage);
      }

      await refetch();
      toast.success("Pedido editado com sucesso", { theme: "colored" });
    } catch (error: any) {
      const backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Erro interno do servidor";
      toast.error(backendMessage, { theme: "colored" });
    } finally {
      setIsLoading(false);
      setEditing(false);
    }
  };

  const handleRemoveItem = (index: number) => {
    setEditOrderData((prev) => {
      const newItems = prev.Items.filter((_, i) => i !== index);
      return { ...prev, Items: newItems };
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setEditOrderData(orderData || ({} as IGetOrder));
  };

  return {
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
    setEditing,
    handleCancel,
    handleSendToSeparation,
  };
};
