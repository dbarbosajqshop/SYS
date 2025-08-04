import { formatMoney } from "@/helpers";
import { IPutItem } from "@/types/items";
import { Paragraph } from "@/ui/typography/Paragraph";
import { Subtitle } from "@/ui/typography/Subtitle";

type Props = {
  itemData: IPutItem;
};

export const ItemVisualize = ({ itemData }: Props) => {
  return (
    <div>
      <div className="flex flex-col gap-4 mb-4">
        <Subtitle variant="large-semibold">Informações do produto:</Subtitle>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">Nome do item:</Paragraph>
          <Paragraph variant="large">{itemData.name}</Paragraph>
        </div>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">
            Valor da caixa fechada:
          </Paragraph>
          <Paragraph variant="large">{formatMoney(itemData.price)}</Paragraph>
        </div>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">Unidades por caixa:</Paragraph>
          <Paragraph variant="large">{itemData.quantityBox}</Paragraph>
        </div>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">Valor de promoção:</Paragraph>
          <Paragraph variant="large">
            {formatMoney(itemData.promotionPrice || 0)}
          </Paragraph>
        </div>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">Cor:</Paragraph>
          <Paragraph variant="large">{itemData.color}</Paragraph>
        </div>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">SKU:</Paragraph>
          <Paragraph variant="large">{itemData.sku}</Paragraph>
        </div>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">NCM:</Paragraph>
          <Paragraph variant="large">{itemData.ncm}</Paragraph>
        </div>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">Código de barras:</Paragraph>
          <Paragraph variant="large">{itemData.upcList?.join(", ")}</Paragraph>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Subtitle variant="large-semibold">Tamanho e peso:</Subtitle>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">Comprimento:</Paragraph>
          <Paragraph variant="large">{itemData.depth} CM</Paragraph>
        </div>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">Largura:</Paragraph>
          <Paragraph variant="large">{itemData.width} CM</Paragraph>
        </div>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">Altura:</Paragraph>
          <Paragraph variant="large">{itemData.height} CM</Paragraph>
        </div>
        <div className="flex justify-between itens-center">
          <Paragraph variant="large-semibold">Peso:</Paragraph>
          <Paragraph variant="large">{itemData.weight}KG</Paragraph>
        </div>
      </div>
    </div>
  );
};
