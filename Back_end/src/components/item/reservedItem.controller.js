import ReservedItem from "./schema/reservedItem.schema.js";

export default class ReservedItemController {
  static async getAllReserved(req, res, next) {
    const items = await ReservedItem.find();
    console.log(items);

    return res.send(items);
  }

  static async deleteAllReserved(req, res, next) {
    return res.send(await ReservedItem.deleteMany());
  }
}
