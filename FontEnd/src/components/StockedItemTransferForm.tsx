import React from 'react';
import { IGetStockedItem, ITransferStockedItem } from '@/types/stockedItems';
import { Input } from '@/ui/Input';

type StockedItemFormProps = {
  selectStockedItem: IGetStockedItem;
  stockedItemData: ITransferStockedItem;
  setStockedItemData: React.Dispatch<React.SetStateAction<ITransferStockedItem>>;
};

const StockedItemTransferForm = ({
  selectStockedItem,
  stockedItemData,
  setStockedItemData,
}: StockedItemFormProps) => {

  return (
    <div>
      <Input
        label="Local de Destino"
        placeholder="Digite o local de destino"
        data={stockedItemData.local}
        onChange={(e) => setStockedItemData({ ...stockedItemData, local: e.target.value })}
      />
      <Input
        label="Quantidade a Transferir"
        placeholder="Digite a quantidade"
        data={String(stockedItemData.quantity)}
        onChange={(e) => setStockedItemData({ ...stockedItemData, quantity: Number(e.target.value) })}
        type="number"
      />
      <p>Item Selecionado: {selectStockedItem.name}</p>
      <p>Quantidade Atual: {selectStockedItem.quantity}</p>
    </div>
  );
};

export default StockedItemTransferForm;