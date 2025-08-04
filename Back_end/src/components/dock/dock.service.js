import Dock from "./schemas/dock.schema.js";

export default class DockService {
  static async paginable(query) {
    let { limit = 10, page = 1, ordenacao = "createdAt: 1" } = query;

    limit = parseInt(limit, 10);
    page = parseInt(page);
    let [campoOrdenacao, order] = ordenacao.split(":");
    order = parseInt(order, 10);

    if (![1, -1].includes(order)) {
      order = -1;
    }

    const docks = await Dock.find({ active: true })
      .sort({ [campoOrdenacao]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    return docks;
  }
}
