import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@/icons/ArrowBack";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Ar } from "@/icons/Ar";
import { Thead } from "@/ui/Thead";
import { Th } from "@/ui/Th";
import { Tr } from "@/ui/Tr";
import { Td } from "@/ui/Td";
import { usePurchases } from "@/hooks/usePurchases";
import { IGetPurchase } from "@/types/purchases";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { Tfoot } from "@/ui/Tfoot";
import { Tdfoot } from "@/ui/Tdfoot";
import { checkItems } from "@/services/purchases";
import { stockPurchase } from "@/services/stockedItems";
import { toast } from "react-toastify";

export default function PurchaseDetail() {
  const [purchaseData, setPurchaseData] = useState<IGetPurchase>({} as IGetPurchase);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [checkedPurchase, setCheckedPurchase] = useState(false);

  const navigate = useNavigate();

  const { fetchPurchase, loading } = usePurchases();

  const fetchPurchaseData = async () => {
    const purchase = await fetchPurchase(location.pathname.split("/")[3]);
    setPurchaseData(purchase);
    console.log(purchase);
  };

  useEffect(() => {
    fetchPurchaseData();
  }, [location.pathname]);

  useEffect(() => {
    const checkAllItems = async () => {
      if (purchaseData.Items?.length === checkedItems.length) {
        const response = await stockPurchase(purchaseData._id);
        if (response.status === 200) {
          setCheckedPurchase(true);
          return toast.success("Compra conferida com sucesso");
        }
        return toast.error("Erro ao conferir compra: ");
      }
    };

    checkAllItems();
  }, [checkedItems]);

  const handleQuantity = (quantity: string) => {
    quantity = quantity.replace(/\D/g, "");
    if (isNaN(Number(quantity))) return;
    return setQuantity(quantity);
  };

  const handleCheckItems = async () => {
    const response = await checkItems(purchaseData._id, {
      sku: itemName,
      boxQuantity: Number(quantity),
    });

    console.log(response);

    if (response.status === 200) {
      if (response.data.status === "parcial")
        return toast.warning("Quantidade inserida diferente da quantidade comprada");
      toast.success("Item conferido com sucesso");
      return setCheckedItems((prevItems) => [...prevItems, itemName]);
    }
    return toast.error(response.data.error);
  };

  if (loading) return <SpinningLogo />;

  return (
    <div className="p-sm sm:px-md bg-neutral-100 h-max">
      <div className="flex flex-col gap-6 p-sm border border-neutral-200 bg-neutral-0">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ArrowBack />
          <Caption color="text-neutral-500" variant="large">
            Compras / {purchaseData?.store}
          </Caption>
        </div>
        <div className="flex flex-col gap-2">
          <Paragraph color="text-neutral-500">Compras na loja:</Paragraph>
          <Subtitle variant="large">{purchaseData.store}</Subtitle>
        </div>

        {purchaseData.state === "entregue" ? (
          <Subtitle variant="large">Compra verificada</Subtitle>
        ) : (
          <div className="flex flex-col sm:flex-row items-center sm:gap-6">
            <Input
              disabled={checkedPurchase}
              wide
              className="bg-neutral-100 w-full"
              placeholder="Insira o item"
              data={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Input
              disabled={checkedPurchase}
              wide
              className="bg-neutral-100 w-full"
              placeholder="Insira a quantidade"
              data={quantity}
              onChange={(e) => handleQuantity(e.target.value)}
            />
            <Button
              disabled={checkedPurchase}
              className="w-full sm:w-auto"
              icon={<Ar />}
              onClick={handleCheckItems}
            >
              Conferir
            </Button>
          </div>
        )}

        <div className="max-w-[330px] sm:max-w-full overflow-x-auto">
          <table className="w-full">
            <Thead>
              <Th>Item</Th>
              <Th>Caixas</Th>
              <Th align="right">{""}</Th>
            </Thead>
            <tbody>
              {purchaseData?.Items?.map((item) => (
                <Tr
                  key={item._id}
                  className={
                    checkedItems.includes(item.itemId?.sku)
                      ? "bg-success-100 border-success-600"
                      : ""
                  }
                >
                  <Td>{item.itemId?.name}</Td>
                  <Td>{item.boxQuantity}</Td>
                  <Td align="right">{""}</Td>
                </Tr>
              ))}
            </tbody>
            <Tfoot>
              <Tdfoot>Total de itens: {purchaseData?.Items?.length}</Tdfoot>
              <Tdfoot>Total de caixas: {purchaseData?.totalItems}</Tdfoot>
              <Tdfoot align="right">
                <Button onClick={() => navigate("/stock/items")}>Ir para estoque</Button>
              </Tdfoot>
            </Tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
