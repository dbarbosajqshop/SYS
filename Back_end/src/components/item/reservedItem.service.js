import ReservedItem from "./schema/reservedItem.schema.js";

export default class ReservedItemService {
  static async reserveItem(id, quantity, type, userId, orderId) {
    const existedReservedItem = await ReservedItem.findOne({
      ItemId: id,
      active: true,
      orderId,
    });

    if (existedReservedItem) {
      if (type === "unit") {
        existedReservedItem.quantityUnit += quantity;
      }
      if (type === "box") {
        existedReservedItem.quantityBox += quantity;
      }
      existedReservedItem.updatedBy = userId;
      existedReservedItem.updatedAt = new Date();
      await existedReservedItem.save();
      return existedReservedItem;
    }

    let reserve = {};
    if (type === "unit") reserve.quantityUnit = quantity;
    if (type === "box") reserve.quantityBox = quantity;

    const newReservedStockedItem = await ReservedItem.create({
      ItemId: id,
      ...reserve,
      orderId,
      createdBy: userId,
      createdAt: new Date(),
      updatedBy: userId,
      updatedAt: new Date(),
      active: true,
    });

    await newReservedStockedItem.save();
    return newReservedStockedItem;
  }

  static async removeReservedItem(orderId) {
    try {
      const reservedItem = await ReservedItem.find({
        orderId,
      });

      if (!reservedItem) {
        console.log("Nenhum item reservado encontrado para o pedido:", orderId);
        return;
      }

      await ReservedItem.deleteMany({
        orderId,
      });

      console.log("Itens reservados removidos:", reservedItem);
    } catch (error) {
      console.error("Erro ao remover itens reservados:", error);
      throw error;
    }
  }
}
