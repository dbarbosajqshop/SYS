import Tax from "./schema/tax.schema.js";

export default class TaxService {
  static async disableTaxes(id) {
    try {
      await Tax.updateMany({ _id: { $not: { $eq: id } } }, { selected: false });
      return true;
    } catch (err) {
      throw new Error(err.message);
    }
  }
}
