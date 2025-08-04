import Order from "../order/schema/order.schema.js";
import ReservedItemService from "../item/reservedItem.service.js";
import ReservedItem from "../item/schema/reservedItem.schema.js";

export default class OrderUpdateService {
  static async reserveItemsForOldOrders() {
    try {
      // Buscar pedidos antigos que não têm itens reservados
      const oldOrders = await Order.find({
        active: true,
        status: { $ne: "cancelado" }, // Ignorar pedidos cancelados
        Items: { $exists: true, $not: { $size: 0 } }, // Pedidos com itens
      }).lean();

      console.log(`Encontrados ${oldOrders.length} pedidos antigos para atualizar.`);

      for (const order of oldOrders) {
        const { _id: orderId, Items, createdBy } = order;

        for (const item of Items) {
          const { ItemId, quantity, type } = item;

          try {
            // Verificar se já existe uma reserva ativa para este item e pedido
            const existingReservation = await ReservedItem.findOne({
              ItemId,
              orderId,
              active: true,
            });

            if (existingReservation) {
              console.log(
                `Reserva já existente para o item ${ItemId} no pedido ${orderId}.`
              );
              continue; // Pular para o próximo item
            }

            // Reservar o item para o pedido
            await ReservedItemService.reserveItem(ItemId, quantity, type, createdBy, orderId);
            console.log(`Item ${ItemId} reservado para o pedido ${orderId}.`);
          } catch (err) {
            console.error(
              `Erro ao reservar o item ${ItemId} para o pedido ${orderId}: ${err.message}`
            );
          }
        }
      }

      console.log("Atualização de pedidos antigos concluída.");
    } catch (err) {
      console.error("Erro ao atualizar pedidos antigos:", err.message);
    }
  }
}