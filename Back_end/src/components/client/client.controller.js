import Client from "./schema/client.schema.js";
import NotFound from "../../errors/notFound.error.js";
import ErrorBase from "../../errors/base.error.js";
import ClientService from "./client.service.js";
import AuditLogClientService from "../client/log/services/auditLogClient.service.js";

export default class ClientController {
  static async getAll(req, res, next) {
    const matchStage = { active: true };
    try {
      if (req.query.client) {
        const itemSearch = req.query.client;
        const itemMatches = await Client.find({
          $or: [
            { cpf: itemSearch },
            { cnpj: itemSearch },
            { email: itemSearch },
            { telephoneNumber: itemSearch },
            { name: { $regex: itemSearch, $options: "i" } },
          ],
        }).sort({ name: 1 });

        if (itemMatches.length > 0) {
          matchStage.ItemId = { $in: itemMatches.map((item) => item._id) };
          req.result = itemMatches;
          return next();
        }
      }

      const clients = await Client.find({ active: true }).sort({ name: 1 });

      req.result = clients;
      return next();
    } catch (err) {
      return next(err.message);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const client = await Client.findOne({ _id: id, active: true });

      if (!client) {
        return next(new NotFound("Cliente não cadastrado."));
      }

      return res.send(client);
    } catch (err) {
      return next(err.message);
    }
  }

  static async create(req, res, next) {
    const { name, cnpj, cpf, email, telephoneNumber } = req.body;
    const { street, neighborhood, number, state, zip, city, complement } = req.body.address;
    const newClient = {
      name,
      cnpj,
      cpf,
      address: {
        street,
        neighborhood,
        number,
        state,
        zip,
        city,
        complement,
      },
      email,
      telephoneNumber,
      createdBy: req.userId,
    };
    try {
      const isClientExisted = await Client.find({ cpf, cnpj, email });
      if (isClientExisted.length > 0) {
        return next(new ErrorBase("Conflito em cliente já existente", 409));
      }

      const client = new Client(newClient);
      const clientSaved = await client.save();

      await AuditLogClientService.logClientAction({
        targetId: clientSaved._id,
        action: "CREATE",
        newData: clientSaved.toObject(),
        changedBy: req.userId,
        req
      });

      res.send(clientSaved);
    } catch (err) {
      return next(err);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const oldClient = await Client.findById(id);
    if (!oldClient) return next(new NotFound("Cliente não encontrado."));

    const {
      name,
      cnpj,
      cpf,
      email,
      telephoneNumber,
      street,
      neighborhood,
      number,
      state,
      zip,
      city,
      complement,
    } = req.body;

    const clientReceived = { updatedBy: req.userId, updatedAt: Date.now() };

    if (name !== undefined) clientReceived["name"] = name;
    if (cnpj !== undefined) clientReceived["cnpj"] = cnpj;
    if (cpf !== undefined) clientReceived["cpf"] = cpf;
    if (email !== undefined) clientReceived["email"] = email;
    if (telephoneNumber !== undefined) clientReceived["telephoneNumber"] = telephoneNumber;
    if (street !== undefined) clientReceived["address.street"] = street;
    if (neighborhood !== undefined) clientReceived["address.neighborhood"] = neighborhood;
    if (number !== undefined) clientReceived["address.number"] = number;
    if (state !== undefined) clientReceived["address.state"] = state;
    if (zip !== undefined) clientReceived["address.zip"] = zip;
    if (city !== undefined) clientReceived["address.city"] = city;              
    if (complement !== undefined) clientReceived["address.complement"] = complement;

    try {
      const updatedClient = await Client.findByIdAndUpdate(
        id,
        { $set: clientReceived },
        { new: true, runValidators: true }
      );

      await AuditLogClientService.logClientAction({
        targetId: id,
        action: "UPDATE",
        previousData: oldClient.toObject(),
        newData: updatedClient.toObject(),
        changedBy: req.userId,
        req
      });

      res.send(updatedClient);
    } catch (err) {
      return next(err);
    }
  }

  static async addVoucherAtClient(req, res, next) {
    const { id } = req.params;
    const { voucher } = req.body;
    try {
      const oldClient = await Client.findById(id);
      voucher.createdBy = req.userId;
      const code = await ClientService.generateCode();
      voucher.code = code;
      await ClientService.validVoucher(voucher);
      const clientReceived = { updatedBy: req.userId, updatedAt: Date.now() };

      const updatedClient = await Client.findByIdAndUpdate(
        id,
        {
          $push: { voucher },
          $set: clientReceived,
        },
        { new: true, runValidators: true }
      );

      await AuditLogClientService.logClientAction({
        targetId: id,
        action: "ADD_VOUCHER",
        previousData: oldClient.toObject(),
        newData: updatedClient.toObject(),
        changedBy: req.userId,
        req
      });

      res.send(updatedClient);
    } catch (err) {
      return next(err);
    }
  }

  static async reative(req, res, next) {
    const { id } = req.params;
    try {
      const oldClient = await Client.findById(id);
      if (oldClient.active) {
        return next(new ErrorBase(`Cliente já está ativo.`, 400));
      }

      const updatedClient = await Client.findByIdAndUpdate(
        id,
        { $set: { active: true, updatedAt: new Date(), updatedBy: req.userId } },
        { new: true }
      );

      await AuditLogClientService.logClientAction({
        targetId: id,
        action: "REACTIVATE",
        previousData: oldClient.toObject(),
        newData: updatedClient.toObject(),
        changedBy: req.userId,
        req
      });

      return res.send({ message: `Cliente ${updatedClient.name} reativado.` });
    } catch (err) {
      return next(err);
    }
  }

  static async delete(req, res, next) {
    const { id } = req.params;
    try {
      const oldClient = await Client.findById(id);
      const updatedClient = await Client.findByIdAndUpdate(
        id,
        { active: false, updatedAt: new Date(), updatedBy: req.userId },
        { new: true }
      );

      await AuditLogClientService.logClientAction({
        targetId: id,
        action: "INACTIVATE",
        previousData: oldClient.toObject(),
        newData: updatedClient.toObject(),
        changedBy: req.userId,
        req
      });

      return res.send({ message: `Cliente ${updatedClient.name} inativado.` });
    } catch (err) {
      return next(err);
    }
  }
}
