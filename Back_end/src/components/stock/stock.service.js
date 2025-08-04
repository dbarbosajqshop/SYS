import Stock from "./schemas/stock.schema.js";

export default class StockService {
  static async paginable(query) {
    let { limit = 10, page = 1, ordenacao = '_id:-1' } = query;

    limit = parseInt(limit, 10);
    page = parseInt(page);
    let [campoOrdenacao, order] = ordenacao.split(':');
    order = parseInt(order, 10);

    if (![1, -1].includes(order)) {
      order = -1; 
    }

    const stocks = await Stock.find({ active: true })
      .populate({
        path: 'Streets',
        select: 'name code _id description',
        match: { active: true },
        populate: {
          path: 'Builds',
          select: 'name code _id description',
          match: { active: true },
          populate: {
            path: 'Floors',
            select: 'name code _id description',
            match: { active: true },
            populate: {
              path: 'StockedItems',
              select: '_id ItemId local quantity',
              match: { active: true },
          }
          }
        }
      })
      .sort({ [campoOrdenacao]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    return stocks
  }
}