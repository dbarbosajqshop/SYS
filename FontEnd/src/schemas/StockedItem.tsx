import { IGetStockedItem, ITransferStockedItem } from "@/types/stockedItems";
import { Input } from "@/ui/Input";
import { Subtitle } from "@/ui/typography/Subtitle";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Select } from "@/ui/Select";

type StockedItemProps = {
  selectStockedItem: IGetStockedItem;
  stockedItemData: ITransferStockedItem;
  setStockedItemData: (
    userData:
      | StockedItemProps["stockedItemData"]
      | ((
          prevData: StockedItemProps["stockedItemData"]
        ) => StockedItemProps["stockedItemData"])
  ) => void;
};

export const StockedItem = ({
  selectStockedItem,
  setStockedItemData,
  stockedItemData,
}: StockedItemProps) => {
  const handleQuantity = (quantity: string) => {
    quantity = quantity.replace(/\D/g, "");
    if (isNaN(Number(quantity))) return;
    return setStockedItemData((prevData) => ({
      ...prevData,
      quantity: Number(quantity),
    }));
  };

  return (
    <div>
      <div className="flex justify-between items-center">
        <Subtitle variant="large-semibold">Local atual:</Subtitle>
        <Paragraph>{selectStockedItem?.local}</Paragraph>
      </div>
      <Input
        wide
        name="local"
        data={stockedItemData.local}
        label="Novo local"
        onChange={(e) =>
          setStockedItemData((prevData) => ({
            ...prevData,
            local: e.target.value,
          }))
        }
        placeholder="Insira o código"
      />
      <Select
        wide
        name="type"
        data={stockedItemData.type}
        label="Tipo"
        onChange={(e) =>
          setStockedItemData((prevData) => ({
            ...prevData,
            type: e.target.value,
          }))
        }
        options={[
          { value: "unit", label: "Unidades" },
          { value: "box", label: "Caixas" },
        ]}
      />
      <Input
        wide
        name="quantity"
        data={stockedItemData.quantity?.toString()}
        label="Quantidade"
        onChange={(e) => handleQuantity(e.target.value)}
        placeholder="Insira a quantidade"
      />
    </div>
  );
};
