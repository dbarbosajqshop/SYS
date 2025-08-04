import { useItems } from "@/hooks/useItems";
import { Add } from "@/icons/Add";
import { ArrowBack } from "@/icons/ArrowBack";
import { Search } from "@/icons/Search";
import { Item } from "@/schemas/Item";
import { INewItem, IPostItem } from "@/types/items";
import { Button } from "@/ui/Button";
import { FormModal } from "@/ui/FormModal";
import { Input } from "@/ui/Input";
import { Caption } from "@/ui/typography/Caption";
import { Subtitle } from "@/ui/typography/Subtitle";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateItem } from "@/hooks/useCreateItem";
import { Thead } from "@/ui/Thead";
import { Th } from "@/ui/Th";
import { Td } from "@/ui/Td";
import { Delete } from "@/icons/Delete";
import { Tr } from "@/ui/Tr";
import { searchItems } from "@/services/items";
import { toast } from "react-toastify";
import {
  dateToISO,
  formatMoney,
  formatNumber,
  handleDateChange,
  userRoles,
} from "@/helpers";
import { Tfoot } from "@/ui/Tfoot";
import { Tdfoot } from "@/ui/Tdfoot";
import { usePurchases } from "@/hooks/usePurchases";
import { SpinningLogo } from "@/icons/SpinningLogo";
import { ItemCard } from "@/components/ItemCard";
import { useProfile } from "@/hooks/useProfile";

export default function NewPurchase() {
  const [storeName, setStoreName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [itemData, setItemData] = useState<IPostItem>({} as IPostItem);
  const [itemPhoto, setItemPhoto] = useState<File | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [items, setItems] = useState<INewItem[]>([]);
  const [searchResults, setSearchResults] = useState<INewItem[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  const { addItem, savePhoto } = useItems();
  const { addPurchase, loading } = usePurchases();
  const { handleSubmit } = useCreateItem(
    itemData,
    setItemData,
    addItem,
    setErrors,
    setOpenModal,
    itemPhoto,
    savePhoto
  );

  const navigate = useNavigate();
  const { profile } = useProfile();
  const roles = userRoles(profile);

  useEffect(() => {
    if (!(roles?.includes("admin") || roles?.includes("supervisor"))) navigate("/stock");
  }, [profile]);

  const handleQuantity = (quantity: string) => {
    quantity = quantity.replace(/\D/g, "");
    if (isNaN(Number(quantity))) return;
    return setQuantity(quantity);
  };

  const handleMonetaryChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");

    const paddedValue = numericValue.padStart(3, "0");

    const integerPart = paddedValue.slice(0, -2);
    const decimalPart = paddedValue.slice(-2);

    const formattedValue = `${parseInt(integerPart, 10)},${decimalPart}`;

    setCostPrice(formattedValue);
  };

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search === "") return toast.error("Insira um SKU ou Código de barras");
    if (quantity === "") return toast.error("Insira uma quantidade");

    const response = await searchItems(search);

    if (response.status === 404) return toast.error("Item não encontrado");

    const foundItems = response.data.data;

    if (foundItems.length === 1) {
      const newItem = {
        ...foundItems[0],
        quantity: Number(quantity),
        costPrice: Number(costPrice.replace("R$ ", "").replace(",", ".")),
      };
      addItemToList(newItem);
    } else {
      setSearchResults(
        foundItems.map((item: INewItem) => ({
          ...item,
          quantity: Number(quantity),
          costPrice: Number(costPrice.replace("R$ ", "").replace(",", ".")),
        }))
      );
      setIsSelecting(true);
    }

    setSearch("");
    setQuantity("");
    setCostPrice("");
  };

  const addItemToList = (selectedItem: INewItem) => {
    const itemExists = items.find((item) => item._id === selectedItem._id);
    if (itemExists) {
      const newItems = items.map((item) => {
        if (item._id === selectedItem._id) {
          item.quantity += selectedItem.quantity;
          item.costPrice = selectedItem.costPrice;
        }
        return item;
      });
      setItems(newItems);
    } else {
      setItems((prev) => [...prev, selectedItem]);
    }
    setSearchResults([]);
    setIsSelecting(false);
  };

  const handleDelete = (id: string) => {
    const newItems = items.filter((item) => item._id !== id);
    setItems(newItems);
  };

  const handleNewPurchase = async () => {
    if (storeName === "") return toast.error("Insira o nome da loja");
    if (purchaseDate === "") return toast.error("Insira a data da compra");
    if (items.length === 0) return toast.error("Insira ao menos um item");

    const data = {
      store: storeName,
      purchaseDate: dateToISO(purchaseDate),
      Items: items.map((item) => ({
        itemId: item._id,
        boxQuantity: item.quantity,
        boxValue: item.costPrice,
      })),
    };
    const response = await addPurchase(data);
    if (response?.status === 200) {
      toast.success("Compra cadastrada com sucesso");
      navigate("/stock");
    }
  };

  return (
    <div className="flex-col sm:flex-row flex justify-stretch p-sm sm:px-md bg-neutral-100 h-max">
      <div className="bg-neutral-0 grow">
        <div className="flex flex-col gap-6 p-sm border border-neutral-200">
          <div
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <ArrowBack />
            <Caption color="text-neutral-500" variant="large">
              Voltar
            </Caption>
          </div>
          <Subtitle variant="large">Cadastrar compra</Subtitle>
          <div className="flex-col sm:flex-row flex items-center gap-0 sm:gap-4">
            <Input
              wide
              className="bg-neutral-100 w-full"
              label="Nome da loja"
              placeholder="Insira o nome da loja"
              data={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
            <Input
              wide
              className="bg-neutral-100 w-full"
              label="Data da compra"
              placeholder="Insira a data da compra"
              data={purchaseDate}
              onChange={(e) => handleDateChange(e.target.value, setPurchaseDate)}
            />
          </div>
        </div>
        <div className="border">
          <form
            onSubmit={handleSearch}
            className="flex-col sm:flex-row flex sm:items-center gap-2 p-sm"
          >
            <Subtitle className="grow w-full" variant="large">
              Itens da compra
            </Subtitle>
            <Input
              wide
              className="bg-neutral-100 grow w-full"
              icon={<Search />}
              iconPosition="left"
              placeholder="Busque por SKU ou Código de barras"
              data={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Input
              className="bg-neutral-100 w-full sm:w-min"
              placeholder="Preço de custo"
              data={costPrice}
              onChange={(e) => handleMonetaryChange(e.target.value)}
            />
            <Input
              className="bg-neutral-100 w-full sm:w-min"
              placeholder="Quantidade"
              data={quantity}
              onChange={(e) => handleQuantity(e.target.value)}
            />
            <Button disabled={quantity === ""} type="submit">
              Adicionar produto
            </Button>
          </form>
          <div className="max-w-[330px] sm:max-w-full overflow-x-auto">
            <table className="w-full">
              <Thead>
                <Th>Produto</Th>
                <Th>Quantidade de caixas</Th>
                <Th>Preço unidade</Th>
                <Th>Preço caixa</Th>
                <Th>Valor final</Th>
                <Th align="right">{""}</Th>
              </Thead>
              <tbody>
                {items.map((item) => (
                  <Tr key={item._id}>
                    <Td>{item.name}</Td>
                    <Td>{item.quantity}</Td>
                    <Td>{formatMoney(item.costPrice)}</Td>
                    <Td>{formatMoney(item.costPrice * item.quantityBox)}</Td>
                    <Td>
                      {formatMoney(item.costPrice * item.quantity * item.quantityBox)}
                    </Td>
                    <Td align="right">
                      <Delete
                        className="cursor-pointer"
                        onClick={() => handleDelete(item._id)}
                        color="#DC2626"
                      />
                    </Td>
                  </Tr>
                ))}
              </tbody>
              <Tfoot>
                <Tdfoot>{items.length}</Tdfoot>
                <Tdfoot>
                  {formatNumber(items.reduce((acc, item) => acc + item.quantity, 0))}
                </Tdfoot>
                <Tdfoot>{""}</Tdfoot>
                <Tdfoot>{""}</Tdfoot>
                <Tdfoot>
                  {formatMoney(
                    items.reduce(
                      (acc, item) =>
                        acc + item.costPrice * item.quantity * item.quantityBox,
                      0
                    )
                  )}
                </Tdfoot>
                <Tdfoot>{""}</Tdfoot>
              </Tfoot>
            </table>
          </div>
          <div className="flex items-center justify-end py-xs px-sm">
            <Button variant="naked">Cancelar</Button>
            {loading ? (
              <SpinningLogo />
            ) : (
              <Button onClick={handleNewPurchase}>Cadastrar Compra</Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 p-sm border bg-neutral-0 min-w-[25%]">
        <FormModal
          open={openModal}
          setOpen={setOpenModal}
          entity="item"
          mode="Criar"
          onSubmit={handleSubmit}
        >
          <Item
            setItemData={setItemData}
            itemData={itemData}
            errors={errors}
            itemPhoto={itemPhoto}
            setItemPhoto={setItemPhoto}
          />
        </FormModal>
        <div className="flex items-center justify-between">
          <Subtitle variant="large">Itens</Subtitle>
          <Button onClick={() => setOpenModal(true)} variant="naked" className="border">
            <Add /> <Caption variant="large">Criar item</Caption>
          </Button>
        </div>
        <div className="max-h-screen overflow-y-auto flex flex-col gap-6">
          {isSelecting && (
            <div className="max-h-screen overflow-y-auto flex flex-col gap-6 p-sm">
              {searchResults.map((item) => (
                <ItemCard
                  key={item._id}
                  item={item}
                  onClick={() => addItemToList(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
