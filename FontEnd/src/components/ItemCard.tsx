import { formatMoney } from "@/helpers";
import { INewItem } from "@/types/items";
import { Caption } from "@/ui/typography/Caption";

type Props = {
  item: INewItem;
  onClick?: () => void;
};

export const ItemCard = ({ item, onClick }: Props) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-col gap-2 p-xxs border border-neutral-200 rounded-nano cursor-pointer"
    >
      <div>
        <Caption variant="small">{item.name}</Caption>
        <Caption variant="small-semibold">{formatMoney(item.price)}</Caption>
      </div>
      <div>
        <Caption variant="small-semibold">Quantidade:</Caption>
        <Caption variant="small">{item.quantity}</Caption>
      </div>
      <div>
        <Caption variant="small-semibold">SKU:</Caption>
        <Caption variant="small">{item.sku}</Caption>
      </div>
    </div>
  );
};
