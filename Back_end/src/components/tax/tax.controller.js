import Tax from "./schema/tax.schema.js";
import NotFound from "../../errors/notFound.error.js";
import ErrorBase from "../../errors/base.error.js";
import TaxService from "./tax.service.js";
import AuditLogTaxService from "../tax/log/service/auditLogTax.service.js";

export default class TaxController {
  static async getAll(req, res, next) {
    try {
      const taxes = await Tax.find({ active: true }).sort({ name: 1 });

      req.result = taxes;
      return next();
    } catch (err) {
      return next(err.message);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const tax = await Tax.findOne({ _id: id, active: true });

      if (!tax) {
        return next(new NotFound("Taxa não cadastrada."));
      }

      return res.send(tax);
    } catch (err) {
      return next(err.message);
    }
  }

  static async getSelected(req, res, next) {
    try {
      const taxes = await Tax.findOne({ active: true, selected: true });

      if (taxes.length === 0) {
        return next(new NotFound("Nenhuma taxa selecionada."));
      }

      return res.send(taxes);
    } catch (err) {
      return next(err.message);
    }
  }

  static async create(req, res, next) {
    const { name, selected, retailTaxPercentage, wholesaleTaxPercentage } = req.body;
    const newTax = {
      ...req.body,
      createdBy: req.userId,
    };
    try {
      const isTaxExisted = await Tax.find({ name });
      if (isTaxExisted.length > 0)
        return next(new ErrorBase("Conflito em taxa já existente", 409));

      if (wholesaleTaxPercentage > retailTaxPercentage)
        return next(new ErrorBase("Porcentagem de atacado não pode ser maior que varejo.", 400));

      const tax = new Tax(newTax);
      const taxSaved = await tax.save();

      if (selected) await TaxService.disableTaxes(taxSaved._id);

      await AuditLogTaxService.logAction(
        "CREATE",
        req.userId,
        taxSaved._id,
        [],
        "Tax"
      );

      res.send(taxSaved);
    } catch (err) {
      return next(err);
    }
  }

  static async updateTax(req, res, next) {
    const { id } = req.params;
    const { selected } = req.body;
    try {
      const oldTax = await Tax.findOne({ _id: id });

      const taxReceived = {
        ...req.body,
        updatedAt: new Date(),
      };

      const taxExisted = await Tax.findByIdAndUpdate(id, {
        $set: taxReceived,
      });

      if (!taxExisted) return next(new NotFound("Taxa não encontrada."));

      if (selected) await TaxService.disableTaxes(taxExisted._id);

      const taxUpdated = await Tax.findById(id);

      const changes = await AuditLogTaxService.getChanges(
        oldTax.toObject(),
        taxUpdated.toObject()
      );
      await AuditLogTaxService.logAction(
        selected ? "SELECT" : "UPDATE",
        req.userId,
        id,
        changes,
        "Tax"
      );

      return res.status(200).send({ message: taxUpdated });
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  static async reative(req, res, next) {
    const { id } = req.params;
    try {
      const isActiveTax = await Tax.findOne({ _id: id, active: true });

      if (isActiveTax !== null) {
        return next(new ErrorBase(`Taxa já está ativo.`, 400));
      }

      const taxInative = await Tax.findByIdAndUpdate(id, {
        $set: { active: true, updatedAt: new Date(), updatedBy: req.userId },
      });
      await taxInative.save();

      await AuditLogTaxService.logAction(
        "REACTIVATE",
        req.userId,
        id,
        [{ field: "active", oldValue: false, newValue: true }],
        "Tax"
      );

      return res.send({ message: `Taxa ${taxInative.name} reativada.` });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;
    try {
      const tax = await Tax.findById(id);
      if (!tax) return next(new NotFound("Taxa não encontrada."));
      if (tax.selected)
        return next(new ErrorBase("Taxa ativa não pode ser deletada.", 400));

      const deletedTax = await Tax.findByIdAndUpdate(id, {
        active: false,
        updatedAt: new Date(),
        updatedBy: req.userId,
      });

      await AuditLogTaxService.logAction(
        "INACTIVATE",
        req.userId,
        id,
        [{ field: "active", oldValue: true, newValue: false }],
        "Tax"
      );

      return res.send({ message: `Taxa ${deletedTax.name} inativada.` });
    } catch (err) {
      return next(err);
    }
  }
}
