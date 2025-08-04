import { OrderItem } from "@/types/orders";
import { Column } from "../column";
import { Row } from "../row";
import { formatMoney } from "@/helpers";
import { HtmlHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Trash2Icon } from "lucide-react";
import { Image, InputNumber } from "antd";

const HeaderItem = ({
  className,
  children,
  ...props
}: HtmlHTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn("text-neutral-500", className)} {...props}>
    {children}
  </p>
);

const Header = () => (
  <Row className="justify-between border-b px-28 pl-8 h-10 bg-neutral-50 text-sm">
    <HeaderItem className="w-8"></HeaderItem>
    <HeaderItem className="w-[40%]">Item</HeaderItem>
    <HeaderItem className="w-32">Tipo</HeaderItem>
    <HeaderItem className="w-44">Preço</HeaderItem>
    <HeaderItem className="w-44">Quantidade</HeaderItem>
  </Row>
);

interface EditableItemsTableProps {
  items: OrderItem[];
  editing: boolean;
  onChange: (index: number, key: string, value: string | number) => void;
  handleRemoveItem: (index: number) => void;
}

export const EditableItemsTable = ({
  items,
  editing,
  onChange,
  handleRemoveItem,
}: EditableItemsTableProps) => {
  // Filtra itens do tipo 'caixa' e 'unidade'
  const filteredItems = items?.filter(
    (item) => item.type !== 'caixa' && item.type !== 'unidade'
  );
  return (
    <>
      <Column className="border">
        <Header />
        {filteredItems?.map((item, index) => (
          <Row
            key={index}
            className="justify-between relative px-28 pl-8 h-12 bg-white text-sm"
          >
            <Image
              height={25}
              width={25}
              preview={false}
              className="object-cover rounded"
              src={item.imageUrl || "/no-image.jpeg"}
            />
            <p className="w-[40%]">{item.ItemId.name}</p>
            <p className="w-32">{item.type === "box" ? "Caixa" : item.type === "unit" ? "Unidade" : ""}</p>
            {/* Exibe o valor total (unitário x quantidade) */}
            <p className="w-44">{formatMoney((item.price ?? item.ItemId.price) * item.quantity)}</p>
            <p className="w-44">
              {editing ? (
                <InputNumber
                  onChange={(value) => onChange(index, "quantity", value || 1)}
                  min={1}
                  keyboard
                  value={item.quantity}
                />
              ) : (
                item.quantity
              )}
            </p>
            {editing && (
              <span
                onClick={() => handleRemoveItem(index)}
                className="absolute cursor-pointer hover:text-error-600 hover:bg-neutral-100 transition-all p-2 rounded-full right-8"
              >
                <Trash2Icon />
              </span>
            )}
          </Row>
        ))}
      </Column>
    </>
  );
};
