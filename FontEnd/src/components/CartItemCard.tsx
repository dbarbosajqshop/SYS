import { formatMoney } from "@/helpers";
import { cn } from "@/lib/utils";
import { IGetCatalogy } from "@/types/catalogy";
import { Caption } from "@/ui/typography/Caption";
import { Button } from "@/ui/Button"; // Supondo que você tenha um componente de botão reutilizável

type Props = {
  item: IGetCatalogy;
  onAddUnit?: () => void;
  onAddBox?: () => void;
  small?: boolean;
  className?: string;
};

export const CartItemCard = ({ item, onAddUnit, onAddBox, small, className }: Props) => {
  return (
    <div className="relative group">
      <div
        className={cn(
          `flex flex-col transition-all border h-48 rounded-nano relative`,
          small ? "w-24 gap-1.5 p-1.5" : "w-36 p-xxs gap-2",
          item.totalBoxes + item.totalUnits <= 0
            ? "border-error-600 bg-error-100"
            : item.isPromotion
            ? "border-brand-600 bg-brand-100"
            : "cursor-pointer border-neutral-200",
          className
        )}
      >
        <img
          src={item?.imageUrl || "/no-image.jpeg"}
          alt={item.name}
          className={cn(
            "w-full transition-all",
            small ? "h-10 object-contain" : "h-14 object-cover"
          )}
        />
        <div className="flex-grow">
          <Caption title={item.name} variant="small">
            {item.name.length > 40 ? item.name.slice(0, 40) + "..." : item.name}
          </Caption>
          <Caption variant="small-semibold">
            {formatMoney(item.isPromotion ? item.promotionPrice : item.price)}
          </Caption>
          {item.totalBoxes + item.totalUnits === 0 && (
            <Caption variant="large-semibold" color="text-error-600">
              Sem estoque
            </Caption>
          )}
        </div>
      </div>
      {item.totalBoxes + item.totalUnits > 0 && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center gap-1 w-4/5">
            <Button disabled={item.totalUnits === 0} onClick={onAddUnit} className="w-full">
              + Unidade
              <span style={{ color: "#fff", fontSize: 12 }}>
                {`${item.totalUnits}`}
              </span>
            </Button>
          </div>
          <div className="flex flex-col items-center gap-1 w-3/4">
            <Button disabled={item.totalBoxes === 0} onClick={onAddBox} className="w-full">
              + Caixa
              <span style={{ color: "#fff", fontSize: 12 }}>
                {`${item.totalBoxes}`}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
