import Street from "./schemas/street.schema.js";

export default class StreetService {
  static async paginable(query) {
    let { limit = 10, page = 1, ordenacao = '_id:-1' } = query;

    limit = parseInt(limit, 10);
    page = parseInt(page);
    let [campoOrdenacao, order] = ordenacao.split(':');
    order = parseInt(order, 10);

    if (![1, -1].includes(order)) {
      order = -1; 
    }

    const streets = await Street.find({ active: true })
      .populate({
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
      })
      .sort({ [campoOrdenacao]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    if (streets.length <= 0) {
      throw new Error('Nenhuma rua cadastrado.');
    }
    return streets
  }
}