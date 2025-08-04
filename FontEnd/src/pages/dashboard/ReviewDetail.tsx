import { Ar } from "@/icons/Ar";
import { ArrowBack } from "@/icons/ArrowBack";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Td } from "@/ui/Td";
import { Tdfoot } from "@/ui/Tdfoot";
import { Tfoot } from "@/ui/Tfoot";
import { Th } from "@/ui/Th";
import { Thead } from "@/ui/Thead";
import { Tr } from "@/ui/Tr";
import { Caption } from "@/ui/typography/Caption";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";
import { IGetOrder, UnitTypeOptions } from "@/types/orders";
import { toast } from "react-toastify";
import { formatUnitType } from "@/helpers";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { checkItem, checkSaveOrder } from "@/services/orders";
import { useProfile } from "@/hooks/useProfile";
import { redirectWarning } from "@/helpers/messagesWarnings";
import { Trash2 } from "lucide-react";
import { IconButton } from "@/ui/IconButton";
import { Select } from "@/ui/Select";

type IChecked = {
  item: {
    _id: string;
    sku: string;
    name: string;
    type: string;
  };
  checkedQuantity: number;
  completed: boolean;
};

export default function ReviewDetail() {
  // const [search, setSearch] = useState("");
  const [orderData, setOrderData] = useState<IGetOrder | undefined>(
    {} as IGetOrder
  );
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("");

  const [checking, setChecking] = useState(false);
  const [itemsChecked, setItemsChecked] = useState<IChecked[]>([]);

  const navigate = useNavigate();

  const { fetchOrder, loading } = useOrders("conferencia");

  const fetchOrderData = async () => {
    const purchase: IGetOrder | undefined = await fetchOrder(
      location.pathname.split("/")[3]
    );
    setOrderData(purchase);
  };

  const location = useLocation();
  const { authorize, permissions } = useProfile();

  useEffect(() => {
    fetchOrderData();
    if (
      permissions.length &&
      (!authorize("r_conference_orders") || !authorize("w_conference_orders"))
    ) {
      navigate("/profile");
      redirectWarning();
    }
  }, [location.pathname]);

  const handleClearItem = (sku: string) => {
    setItemsChecked((prevItemsChecked) => {
      const item = prevItemsChecked.find((item) => item.item.sku === sku);

      const newItems = prevItemsChecked.filter((item) => item.item.sku !== sku);

      if (item)
        newItems.push({ ...item, checkedQuantity: 0, completed: false });

      return newItems;
    });
  };

  const handleCheckItems = async () => {
    setChecking(true);
    if (!orderData?._id) return;
    try {
      const existingItem = itemsChecked.find(
        (item) => item.item.sku === itemName && item.item.type === type
      );
      const response = await checkItem(orderData?._id, {
        value: itemName,
        quantity: Number(quantity),
        type,
        checkedQuantity: existingItem?.checkedQuantity || 0,
      });

      if (response.status === 200) {
        const itemData = response.data;
        const quantityAtOrder = itemData.quantityAtOrder;

        setItemsChecked((prevItemsChecked) => {
          const existingItem = prevItemsChecked.find(
            (item) =>
              item.item.sku === itemData.item.sku &&
              item.item.type === itemData.item.type
          );
          if (existingItem) {
            const updatedItems = prevItemsChecked.map((item) =>
              item.item.sku === itemName && item.item.type === type
                ? {
                    ...item,
                    type: itemData.item.type,
                    checkedQuantity: item.checkedQuantity + Number(quantity),
                    completed:
                      item.checkedQuantity + Number(quantity) ===
                      quantityAtOrder,
                  }
                : item
            );
            return updatedItems;
          }
          return [
            ...prevItemsChecked,
            {
              item: itemData.item,
              checkedQuantity: Number(quantity),
              completed: Number(quantity) === quantityAtOrder,
            },
          ];
        });
      }
      return toast.error(response.data.error);
    } catch (error) {
      console.error("Erro ao verificar item:", error);
    } finally {
      setChecking(false);
      setItemName("");
      setQuantity("");
    }
  };

  const handleCheckSave = async () => {
    if (!orderData?._id) return;
    try {
      const response = await checkSaveOrder(orderData?._id, itemsChecked);
      if (response.status === 200) {
        if (response.data.message === "Itens pendentes")
          return navigate("/dashboard/pending");
        return navigate("/sales/" + orderData?._id);
      }
      return toast.error(response.data.error || response.data.message);
    } catch (error) {
      console.error("Erro ao salvar conferência:", error);
    }
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
            Dashboard / Conferência
          </Caption>
        </div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div className="min-w-[30%]">
            <Paragraph color="text-neutral-500">Pedido:</Paragraph>
            <Subtitle variant="large">
              #{orderData?.orderNumber || "N/A"}
            </Subtitle>
          </div>
          {/* <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 grow">
            <Input
              wide
              className="bg-neutral-0 w-full"
              icon={<Search />}
              iconPosition="left"
              data={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button
              variant="naked"
              color="default"
              className="border"
              onClick={() => {}}
            >
              <Filter /> <Caption variant="large">Filtros</Caption>
            </Button>
            <Button
              variant="naked"
              color="default"
              className="border"
              onClick={() => {}}
            >
              <Pdf /> <Caption variant="large">Exporta em PDF</Caption>
            </Button>
          </div> */}
        </div>
        {orderData?.status != "conferencia" ? (
          <Subtitle variant="large">Compra não está em conferência</Subtitle>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCheckItems();
            }}
            className="flex flex-col sm:flex-row items-center sm:gap-6"
          >
            <Input
              wide
              className="bg-neutral-100 w-full"
              placeholder="Insira o item"
              data={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />{" "}
            <Select
              placeholder="Tipo de Quantidade"
              className="bg-neutral-100 min-w-52 w-full"
              data={type}
              options={UnitTypeOptions}
              onChange={(e) => setType(e.target.value)}
            />
            <Input
              className="bg-neutral-100 w-auto"
              placeholder="Quantidade"
              data={quantity || ""}
              type="number"
              onChange={(e) =>
                setQuantity(Number(e.target.value) > 0 ? e.target.value : "")
              }
            />
            {checking ? (
              <SpinningLogo />
            ) : (
              <Button type="submit" className="w-full sm:w-auto" icon={<Ar />}>
                Conferir
              </Button>
            )}
          </form>
        )}

        <div className="max-w-[330px] sm:max-w-full overflow-x-auto">
          <table className="w-full">
            <Thead>
              <Th></Th>
              <Th>Item</Th>
              <Th>Tipo</Th>
              <Th>Quantidade</Th>
              <Th>Qntd. Checado</Th>

              <Th align="right">{""}</Th>
            </Thead>
            <tbody>
              {orderData?.Items?.map((item) => {
                const inCheckingItem = itemsChecked.find(
                  (i) =>
                    i.item?.sku === item.ItemId.sku && i.item.type === item.type
                );
                return (
                  <Tr
                    key={item._id}
                    className={`${
                      inCheckingItem?.completed
                        ? "bg-success-100 border-success-600"
                        : ""
                    }`}
                  >
                    <Td>
                      <img
                        className="w-12 h-12"
                        src={item.imageUrl || "/no-image.jpeg"}
                        alt={item.ItemId?.name}
                      />
                    </Td>
                    <Td>{item.ItemId?.name}</Td>
                    <Td>{formatUnitType(item.type || "")}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>{inCheckingItem?.checkedQuantity || 0}</Td>

                    <Td align="right">
                      <IconButton
                        size="medium"
                        onClick={() => handleClearItem(item.ItemId.sku)}
                      >
                        <Trash2 />
                      </IconButton>
                    </Td>
                  </Tr>
                );
              })}
            </tbody>
            <Tfoot>
              <Tdfoot>{orderData?.Items?.length}</Tdfoot>
              <Td align="right">{""}</Td>
              <Tdfoot>{orderData?.totalQuantity}</Tdfoot>
              <Td align="right">{""}</Td>

              <Tdfoot align="right">
                <Button
                  disabled={
                    !(
                      itemsChecked.every((item) => item.completed) &&
                      itemsChecked.length === orderData?.Items?.length
                    )
                  }
                  onClick={handleCheckSave}
                >
                  Conferir
                </Button>
              </Tdfoot>
            </Tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
