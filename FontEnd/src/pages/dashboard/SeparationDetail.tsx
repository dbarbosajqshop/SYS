import { Ar } from "@/icons/Ar";
import { ArrowBack } from "@/icons/ArrowBack";
import { Search } from "@/icons/Search";
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
import { useEffect, useState, ChangeEvent } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useOrders } from "@/hooks/useOrders";
import { UnitTypeOptions, IGetOrder, OrderItem } from "@/types/orders";
import { toast } from "react-toastify";
import { formatMoney, formatUnitType } from "@/helpers";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { separateItems, saveOrder } from "@/services/orders"; 
import { useProfile } from "@/hooks/useProfile";
import { redirectWarning } from "@/helpers/messagesWarnings";
import { Select } from "@/ui/Select";
import { useQuery } from "@tanstack/react-query";
import { useStockedItems } from "@/hooks/useStockedItems";
import { IStockedLocation } from "@/services/stockedItems"; 

export default function SeparationDetail() {
  const [search, setSearch] = useState("");
  const [skuInput, setSkuInput] = useState("");
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [selectedLocal, setSelectedLocal] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [quantity, setQuantity] = useState("");
  const [checking, setChecking] = useState(false);
  const [availableLocations, setAvailableLocations] = useState<IStockedLocation[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { authorize, permissions } = useProfile();
  const { id } = useParams();
  const { fetchOrder } = useOrders("separacao");
  const { fetchStockedLocationsByItemId } = useStockedItems();

  useEffect(() => {
    if (
      permissions.length &&
      (!authorize("r_separation_orders") || !authorize("w_separation_orders"))
    ) {
      navigate("/profile");
      redirectWarning();
    }
  }, [location.pathname, authorize, permissions, navigate]);

  const {
    data: orderData,
    isLoading,
    refetch,
  } = useQuery<IGetOrder | undefined>({
    queryKey: ["separationOrder", id, checking],
    refetchOnWindowFocus: false,
    enabled: !!id,
    queryFn: () => fetchOrder(id as string),
  });

  useEffect(() => {
    const fetchLocations = async () => {
      if (selectedItem && selectedItem.ItemId?._id && selectedType) {
        const locations = await fetchStockedLocationsByItemId(selectedItem.ItemId._id, selectedType);
        setAvailableLocations(locations);
        if (locations.length === 1) {
          setSelectedLocal(locations[0].local);
        } else {
          setSelectedLocal("");
        }
      } else {
        setAvailableLocations([]);
        setSelectedLocal("");
      }
    };
    fetchLocations();
  }, [selectedItem, selectedType, fetchStockedLocationsByItemId]);

  const handleSkuInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSkuInput(value);
    const foundItem: OrderItem | undefined = orderData?.Items?.find(
      (item: OrderItem) => item.ItemId?.sku?.toLowerCase() === value.toLowerCase()
    );

    if (foundItem) {
      setSelectedItem(foundItem);

    } else {
      setSelectedItem(null);
      setSelectedLocal("");
      setAvailableLocations([]);
      setSelectedType("");
      setQuantity("");
    }
  };

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setSelectedLocal("");
    setQuantity("");
  };

  const handleQuantityChange = (inputQuantity: string) => {
    const cleanedQuantity = inputQuantity.replace(/\D/g, "");
    if (isNaN(Number(cleanedQuantity))) return;
    setQuantity(cleanedQuantity);
  };

  const handleCheckItems = async () => {
    setChecking(true);
    if (!orderData?._id) {
      setChecking(false);
      return toast.error("Dados do pedido não disponíveis.");
    }

    if (!selectedItem || !selectedItem.ItemId?._id) {
      setChecking(false);
      return toast.error("Por favor, insira um SKU válido e selecione o item.");
    }

    if (!selectedType) {
      setChecking(false);
      return toast.error("Por favor, selecione o tipo (unidade/caixa).");
    }

    if (!selectedLocal) {
      setChecking(false);
      return toast.error("Por favor, selecione um local de estoque.");
    }

    if (Number(quantity) <= 0 || isNaN(Number(quantity))) {
      setChecking(false);
      return toast.error("Por favor, insira uma quantidade válida maior que zero.");
    }

    const response = await separateItems(orderData._id, {
      local: selectedLocal,
      value: selectedItem.ItemId._id, 
      type: selectedType,
      quantity: Number(quantity),
    });

    if (response.status === 404) {
      setChecking(false);
      return toast.error(
        response.data.error || response.data.message || "Item não encontrado no estoque ou na ordem."
      );
    }

    if (response.status !== 200) {
      setChecking(false);
      return toast.error(
        response.data.error ||
        response.data.message ||
        "Algo deu errado ao separar o item!"
      );
    }

    if (
      response.data.quantityAtOrder &&
      response.data.quantityAtOrder !== Number(quantity)
    ) {
      toast.warning(
        "Quantidade inserida diferente da quantidade pedida. Verifique os detalhes do pedido."
      );
    } else {
      toast.success("Item separado com sucesso!");
    }

    setSkuInput("");
    setSelectedItem(null);
    setSelectedLocal("");
    setQuantity("");
    setSelectedType("");
    setAvailableLocations([]);
    setChecking(false);
    refetch();
  };

  const itemBg = (itemStatus: string) => {
    switch (itemStatus) {
      case "correto":
        return "bg-success-100 border-success-600";
      case "incorreto":
        return "bg-warning-100 border-warning-600";
      case "parcial":
        return "bg-warning-100 border-warning-600";
      default:
        return "";
    }
  };

  const handleSaveOrder = async () => {
    if (!orderData?._id) {
      return toast.error("ID do pedido não disponível para salvar.");
    }
    const response = await saveOrder(orderData._id);
    if (response.status === 200) {
      toast.success(response.data.message);
      return navigate("/dashboard/review");
    }
    return toast.error(
      response.data.message || response.data.error || "Erro ao salvar o pedido.",
      {
        theme: "colored",
      }
    );
  };

  if (isLoading) return <SpinningLogo />;

  return (
    <div className="p-sm sm:px-md bg-neutral-100 h-max">
      <div className="flex flex-col gap-6 p-sm border border-neutral-200 bg-neutral-0">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ArrowBack />
          <Caption color="text-neutral-500" variant="large">
            Dashboard / Separação
          </Caption>
        </div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <div className="min-w-[30%]">
            <Paragraph color="text-neutral-500">Pedido:</Paragraph>
            <Subtitle variant="large">#{orderData?.orderNumber || "N/A"}</Subtitle>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 grow">
            <Input
              wide
              className="bg-neutral-0 w-full"
              icon={<Search />}
              iconPosition="left"
              data={search}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              placeholder="Buscar itens no pedido..."
            />
          </div>
        </div>
        {orderData?.status !== "separacao" ? (
          <Subtitle variant="large">O pedido não está em status de separação.</Subtitle>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
            <div className="flex-1 w-full min-w-[150px]">
              <Input
                className="bg-neutral-100 w-full"
                placeholder="Digite o SKU do item"
                data={skuInput}
                onChange={handleSkuInputChange}
              />
            </div>

            <div className="w-full sm:w-48 min-w-[120px]">
              <Select
                placeholder="Tipo de Quantidade"
                className="bg-neutral-100 w-full"
                data={selectedType}
                onChange={handleTypeChange}
                options={UnitTypeOptions}
                disabled={!selectedItem}
              />
            </div>

            <div className="flex-1 w-full min-w-[150px]">
              <Select
                className="bg-neutral-100 w-full"
                placeholder="Selecione o local"
                data={selectedLocal}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setSelectedLocal(e.target.value)
                }
                options={availableLocations.map((loc) => ({
                  label: `${loc.local} (Disponível: ${loc.quantity})`,
                  value: loc.local,
                }))}
                disabled={!selectedItem || !selectedType || availableLocations.length === 0}
              />
            </div>

            <div className="w-full sm:w-48 min-w-[120px]">
              <Input
                className="bg-neutral-100 w-full"
                placeholder="Quantidade"
                data={quantity}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleQuantityChange(e.target.value)
                }
                type="number"
                min="1"
                disabled={!selectedItem || !selectedType || !selectedLocal}
              />
            </div>

            <div className="w-full sm:w-auto mt-2 sm:mt-0">
              {checking ? (
                <SpinningLogo />
              ) : (
                <Button
                  className="w-full"
                  icon={<Ar />}
                  onClick={handleCheckItems}
                  disabled={
                    !selectedItem ||
                    !selectedType ||
                    !selectedLocal ||
                    Number(quantity) <= 0
                  }
                >
                  Conferir
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="max-w-[330px] sm:max-w-full overflow-x-auto">
          <table className="w-full">
            <Thead>
              <Th></Th>
              <Th>Item</Th>
              <Th>Local</Th>
              <Th>Tipo</Th>
              <Th>Quantidade</Th>
              <Th align="right">{""}</Th>
            </Thead>
            <tbody>
              {orderData?.Items?.filter(
                (item: OrderItem) => 
                  item.ItemId?.name?.toLowerCase().includes(search.toLowerCase()) ||
                  item.ItemId?.sku?.toLowerCase().includes(search.toLowerCase()) ||
                  item.ItemId?.upc?.toLowerCase().includes(search.toLowerCase())
              ).map((item: OrderItem) => ( 
                <Tr key={item._id} className={itemBg(item.itemStatus)}>
                  <Td>
                    <img
                      className="w-12 h-12"
                      src={item.imageUrl || "/no-image.jpeg"}
                      alt={item.ItemId?.name}
                    />
                  </Td>
                  <Td>
                    {item.ItemId?.name} ({item.ItemId?.sku})
                  </Td>
                  <Td>{item.localToBeRemoved || "N/A"}</Td>
                  <Td>{formatUnitType(item.type || "")}</Td>
                  <Td>{item.quantity}</Td>
                  <Td align="right">{""}</Td>
                </Tr>
              ))}
            </tbody>
            <Tfoot>
              <Tdfoot>{formatMoney(orderData?.totalPrice as number)}</Tdfoot>
              <Tdfoot>{orderData?.Items?.length}</Tdfoot>
              <Tdfoot></Tdfoot>
              <Tdfoot></Tdfoot>
              <Tdfoot>{orderData?.totalQuantity}</Tdfoot>
              <Tdfoot align="right">
                <Button onClick={handleSaveOrder}>Separar</Button>
              </Tdfoot>
            </Tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};