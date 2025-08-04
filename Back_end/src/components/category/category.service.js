import Category from "./schemas/category.schema.js";

export default class CategoryService {
  static async paginable(query) {
    let { limit = 10, page = 1, ordenacao = "name: 1" } = query;

    limit = parseInt(limit, 10);
    page = parseInt(page);
    let [campoOrdenacao, order] = ordenacao.split(":");
    order = parseInt(order, 10);

    if (![1, -1].includes(order)) {
      order = -1;
    }

    const categorys = await Category.find({ active: true })
      .sort({ [campoOrdenacao]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    return categorys;
  }
}
