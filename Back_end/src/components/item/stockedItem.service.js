import ErrorBase from "../../errors/base.error.js";
import Floor from "../floor/schema/floor.schema.js";
import Item from "./schema/item.schema.js";
import StockedItem from "./schema/stockedItem.schema.js";

export default class StockedItemService {
  static async validExistsAnAlreadyStockedItem(itemId, local, type) {
    const isExisted = await StockedItem.findOne({
      ItemId: itemId,
      local,
      type,
      active: true,
    });

    if (!isExisted) return null;

    return { id: isExisted._id, quantity: isExisted.quantity };
  }

  static async incrementQuantityItem(stockedItem, newQuantity) {
    const currentQuantity = Number(stockedItem.quantity) || 0;
    const incrementValue = Number(newQuantity);

    if (isNaN(incrementValue)) throw new Error("newQuantity must be a valid number");

    const updatedQuantity = currentQuantity + incrementValue;

    const updatedStockedItem = await StockedItem.findByIdAndUpdate(
      stockedItem.id,
      { $set: { quantity: updatedQuantity } },
      { new: true }
    );

    return updatedStockedItem;
  }

  static async findDuplicateItemsByFloor(floorId) {
    // Busca todos os itens estocados no floorId
    const stockedItems = await StockedItem.find({ FloorId: floorId });

    if (stockedItems.length === 0) return null;

    // Agrupa os itens por ItemId
    const itemsGroupedByItemId = stockedItems.reduce((acc, stockedItem) => {
      const key = stockedItem.ItemId.toString();
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(stockedItem);
      return acc;
    }, {});

    // Filtra os grupos onde há duplicatas (mais de um item com o mesmo ItemId)
    const duplicateItems = Object.values(itemsGroupedByItemId).filter(
      (items) => items.length > 1
    );

    return duplicateItems.length > 0 ? duplicateItems : null;
  }

  static async consolidateItems(duplicateItems) {
    let result = [];

    for (const items of duplicateItems) {
      let totalQuantity = items[0].quantity;
      const primaryStockedItem = items[0];

      // Soma as quantidades dos itens duplicados e remove-os
      for (let i = 1; i < items.length; i++) {
        totalQuantity += items[i].quantity;
        await StockedItem.findByIdAndDelete(items[i]._id);
      }

      // Atualiza a quantidade do item principal
      primaryStockedItem.quantity = totalQuantity;
      await primaryStockedItem.save();

      result.push(primaryStockedItem);
    }

    return result;
  }

  static async transferItemToNewLocation(id, local, type, quantity, userId) {
    // Busca o item estocado existente
    const existedStockedItem = await StockedItem.findOne({
      _id: id,
      active: true,
    });
    if (!existedStockedItem) throw new ErrorBase("Item não encontrado.", 404);

    // Busca o local de destino
    const destinationFloor = await Floor.findOne({ localCode: local });
    if (!destinationFloor) throw new ErrorBase("Local de destino não encontrado.", 404);

    // Verifica se a transferência é necessária
    if (
      existedStockedItem.local === local &&
      existedStockedItem.type === type &&
      existedStockedItem.quantity >= quantity
    ) {
      throw new ErrorBase("Este item já está no local e tipo especificados.", 409);
    }

    // Valida se há quantidade suficiente para transferir
    if (existedStockedItem.quantity < quantity)
      throw new ErrorBase("Quantidade insuficiente para transferir.", 400);

    // Calcula a nova quantidade no estoque original
    const updatedQuantity = existedStockedItem.quantity - quantity;

    // Atualiza a quantidade no estoque original
    existedStockedItem.quantity = updatedQuantity;
    existedStockedItem.updatedBy = userId;
    existedStockedItem.updatedAt = new Date();
    await existedStockedItem.save();

    // Calcula a nova quantidade no destino com base no tipo de conversão
    let newQuantity = quantity;
    if (type === "unit" && existedStockedItem.type === "box") {
      // Multiplica pela quantidade por caixa
      const item = await Item.findById(existedStockedItem.ItemId);
      newQuantity = quantity * item.quantityBox;
    }

    // Busca ou cria o item estocado no local de destino
    let destinationStockedItem = await StockedItem.findOne({
      ItemId: existedStockedItem.ItemId,
      FloorId: destinationFloor._id,
      type,
    });

    if (destinationStockedItem) {
      if (destinationStockedItem.costPrice) {
        const totalQuantity = destinationStockedItem.quantity + newQuantity;
        destinationStockedItem.costPrice =
          (destinationStockedItem.costPrice * destinationStockedItem.quantity +
            existedStockedItem.costPrice * newQuantity) /
          totalQuantity;
      } else destinationStockedItem.costPrice = existedStockedItem.costPrice;
      // Atualiza a quantidade no destino existente
      destinationStockedItem.quantity += newQuantity;
      destinationStockedItem.updatedBy = userId;
      destinationStockedItem.updatedAt = new Date();
      await destinationStockedItem.save();
    } else {
      // Cria um novo item estocado no destino
      destinationStockedItem = await StockedItem.create({
        ItemId: existedStockedItem.ItemId,
        FloorId: destinationFloor._id,
        local: local,
        costPrice: existedStockedItem.costPrice,
        type,
        quantity: newQuantity,
        createdBy: userId,
        createdAt: new Date(),
        updatedBy: userId,
        updatedAt: new Date(),
        active: true,
      });
    }

    // Adiciona o item estocado ao local de destino
    if (!destinationFloor.StockedItems.includes(destinationStockedItem._id)) {
      destinationFloor.StockedItems.push(destinationStockedItem._id);
      await destinationFloor.save();
    }

    return {
      originalStockedItem: existedStockedItem,
      destinationStockedItem,
    };
  }

  static async removeItem(itemId, quantityToRemove) {
    let remainingQuantity = quantityToRemove;

    const stockItems = await StockedItem.find({
      ItemId: itemId,
      active: true,
      quantity: { $gt: 0 },
    })
      .populate({ path: "ItemId", select: "quantityBox" })
      .sort({ type: -1 }); // Ordena por unidades primeiro ('unit' > 'box')

    for (const stock of stockItems) {
      if (remainingQuantity <= 0) break;

      const quantityPerBox = stock.ItemId?.quantityBox || 1;
      let availableQuantity =
        stock.type === "box" ? stock.quantity * quantityPerBox : stock.quantity;

      const toRemove = Math.min(availableQuantity, remainingQuantity);
      remainingQuantity -= toRemove;

      if (toRemove > 0) {
        if (stock.type === "unit") {
          // Remove diretamente unidades
          stock.quantity -= toRemove;
        } else {
          // Remove caixas e converte para unidades
          const boxesToRemove = Math.floor(toRemove / quantityPerBox);
          const remainingUnits = toRemove % quantityPerBox;

          stock.quantity -= boxesToRemove;

          if (remainingUnits > 0) {
            throw new Error(
              `Sobrou ${remainingUnits} unidades que não podem ser removidas diretamente de caixas.`
            );
          }
        }

        await stock.save();
      }
    }

    if (remainingQuantity > 0) {
      throw new Error(`Estoque insuficiente para o item ${itemId}`);
    }

    return { itemId, removedQuantity: quantityToRemove };
  }
}
