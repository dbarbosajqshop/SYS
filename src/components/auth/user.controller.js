import ErrorBase from "../../errors/base.error.js";
import NotFound from "../../errors/notFound.error.js";
import User from "./schema/user.schema.js";
import UserService from "./user.service.js";
import bcrypt from "bcrypt";
import Role from "./schema/role.schema.js";
import MoneyAccountService from "../moneyAccount/services/moneyAccount.service.js";
import AuditLogUserService from "./log/service/auditLogUser.service.js";

export default class UserController {
  static async getSupervisorPassword(req, res, next) {
    try {
      const nextInitialCode = await UserService.getNextSpPassword();

      return res.status(200).json({
        success: true,
        message: "Código inicial da senha obtido com sucesso.",
        nextInitialCode: nextInitialCode,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async validateSupervisorPassword(req, res, next) {
    const { password } = req.body;

    try {
      const isValid = await UserService.validateSupervisorPassword(password);

      if (!isValid)
        return res.status(403).send({ message: "Senha de supervisor incorreta." });

      return res.send({ message: "Senha de supervisor correta." });
    } catch (err) {
      if (err) {
        return next(new ErrorBase(err.message, 403));
      }
      return next(err);
    }
  }

  static async createOrEditSpPassword(req, res, next) {
    try {
      const { id } = req.params;
      const { supervisorPassword } = req.body;

      if (!id || !supervisorPassword)
        return res.status(400).json({ message: "ID e senha são obrigatórios." });

      const result = await UserService.updateSupervisorPassword(id, supervisorPassword);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  static async getAllActives(req, res, next) {
    try {
      const users = await User.find({
        active: true,
        email: { $not: /@gf\.com$/ },
      })
        .populate({
          path: "Roles",
          match: { active: true },
          select: "name",
        })
        .sort({ name: 1 });

      if (users.length === 0)
        return res
          .status(404)
          .send({ message: "Não existe nenhum usuário cadastrado ainda." });

      req.result = users;
      next();
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  }

  static async getAll(req, res, next) {
    try {
      const users = await User.find()
        .populate({
          path: "Roles",
          match: { active: true },
          select: "name _id",
        })
        .sort({ name: 1 });

      if (users.length === 0)
        return res
          .status(404)
          .send({ message: "Não existe nenhum usuário cadastrado ainda." });

      req.result = users;
      next();
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;

    try {
      if (!id) return res.status(400).send({ message: "ID não enviado." });

      const user = await User.findOne({ _id: id, active: true }).populate({
        path: "Roles",
        match: { active: true },
        select: "name",
        populate: {
          path: "permissions",
          match: { active: true },
          select: "name",
        },
      });

      if (!user) return res.status(404).send({ message: "Usuário não existente." });

      return res.send(user);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  }

  static async getUserByNameAndEmail(req, res, next) {
    const { name, email } = req.query;

    try {
      const query = {};
      const conditions = [];

      if (name) conditions.push({ name: new RegExp(name, "i") });

      if (email) conditions.push({ email: new RegExp(email, "i") });

      if (conditions.length > 0) query.$or = conditions;

      query.email = { $not: /@gf\.com$/ };

      const users = await User.find(query)
        .populate({
          path: "Roles",
          match: { active: true },
          select: "name _id",
        })
        .sort({ name: 1 });

      if (users.length === 0) {
        return res.status(404).send({ message: "Nenhum usuário encontrado" });
      }

      req.result = users;
      next();
    } catch (err) {
      return next(err.message);
    }
  }

  static async findPhotoById(req, res, next) {
    const { id } = req.params;

    try {
      const userExisted = await User.findById(id);

      if (!userExisted.nameImage) return next(new NotFound("Image not found"));

      res.set("Content-Type", userExisted.contentType);
      res.send(userExisted.dataImage);
    } catch (err) {
      return next(err);
    }
  }

  static async create(req, res, next) {
    const { name, password, email, role } = req.body;
    const hashedPassword = await UserService.encryptPassword(password);

    const roleFounded = await Role.findOne({ name: role });
    if (!roleFounded) return next(new NotFound("Role não encontrada."));
    const userReceived = {
      name,
      email,
      password: hashedPassword,
      Roles: [roleFounded._id],
      createdBy: req.userId,
    };

    try {
      const userExisted = await User.findOne({ email });

      if (userExisted) return res.status(409).json({ message: "Usuário já existe." });

      const newUser = new User(userReceived);
      const userSaved = await newUser.save();

      await MoneyAccountService.createUserMoneyAccount(userSaved._id, req.userId);

      await AuditLogUserService.logAction(
        "CREATE",
        req.userId,
        userSaved._id,
        Object.entries(userReceived).map(([field, value]) => ({
          field,
          newValue: value
        }))
      );

      res.send(userSaved);
    } catch (err) {
      return res.status(500).send({ message: err.message });
    }
  }

  static async login(req, res, next) {
    const { email, password } = req.body;
    try {
      const isValidAccessAndReceiveToken = await UserService.validEmailAndPassword(
        email,
        password
      );
      if (!isValidAccessAndReceiveToken)
        return next(new ErrorBase("Senha incorreta.", 401));
      res.send(isValidAccessAndReceiveToken);
    } catch (err) {
      if (err.message === "Email não encontrado.")
        return next(new ErrorBase("Email não encontrado.", 401));

      return next(err);
    }
  }

  static async updateUser(req, res, next) {
    const { id } = req.params;
    const { name, email, role } = req.body;
    try {
      const oldUserData = await User.findById(id);
      if (!oldUserData) return next(new NotFound("Usuário não encontrado."));

      const userReceived = {
        name,
        email,
        role,
        updatedBy: req.userId,
        updatedAt: new Date(),
      };
      const userExisted = await User.findByIdAndUpdate(id, {
        $set: userReceived,
      });
      if (!userExisted) return next(new NotFound("Usuário não encontrado."));

      const newUserData = await User.findById(id);

      const changes = await AuditLogUserService.getChanges(oldUserData.toObject(), newUserData.toObject());
      if (changes.length > 0) {
        await AuditLogUserService.logAction(
          "UPDATE",
          req.userId,
          id,
          changes
        );
      }

      return res.status(200).send({ message: newUserData });
    } catch (err) {
      return res.status(500).send(err);
    }
  }

  static async updatePassword(req, res) {
    const { id } = req.params;
    const { actualPassword, password } = req.body;

    try {
      const user = await User.findById(id);
      if (!user) return res.status(404).send({ message: "Usuário não existente." });

      const validActualPassword = await bcrypt.compare(actualPassword, user.password);
      if (!validActualPassword)
        return res.status(401).send({ message: "Senha atual incorreta." });

      const hashedPassword = await UserService.encryptPassword(password);
      const newPassword = {
        password: hashedPassword,
        updatedAt: new Date(),
        updatedBy: req.userId,
      };

      const userSaved = await User.findByIdAndUpdate(
        id,
        { $set: newPassword },
        { new: true }
      );

      if (userSaved) {
        await AuditLogUserService.logAction(
          "UPDATE",
          req.userId,
          id,
          [{ field: "password", oldValue: null, newValue: "*****" }]
        );

        return res.send({ message: "Senha atualizada." });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: err.message });
    }
  }

  static async savePhoto(req, res, next) {
    const { id } = req.params;

    await UserService.validImageFormat(req.file.mimetype);
    const buffer1080x1080 = await UserService.resizedImage(req.file.buffer);

    try {
      const oldUserData = await User.findById(id);
      if (!oldUserData) return next(new NotFound("Usuário não encontrado."));

      const newPhoto = {
        nameImage: req.file.originalname,
        dataImage: buffer1080x1080,
        contentType: req.file.mimetype,
        updatedAt: new Date(),
        updatedBy: req.userId,
      };

      const userExisted = await User.findByIdAndUpdate(id, { $set: newPhoto });
      if (!userExisted) return next(new NotFound("Usuário não encontrado."));

      await AuditLogUserService.logAction(
        "UPDATE",
        req.userId,
        id,
        [
          {
            field: "nameImage",
            oldValue: oldUserData.nameImage,
            newValue: req.file.originalname
          },
          {
            field: "contentType",
            oldValue: oldUserData.contentType,
            newValue: req.file.mimetype
          }
        ]
      );

      const userUpdated = await User.findById(id);
      res.set("Content-Type", userUpdated.contentType);
      res.send(userUpdated.dataImage);
    } catch (e) {
      return next(e);
    }
  }

  static async reativeUser(req, res, next) {
    const { id } = req.params;
    try {
      const isActiveUser = await User.findOne({ _id: id, active: true });
      if (isActiveUser !== null)
        return next(new ErrorBase("Usuario já ativo encontrado.", 400));

      const userInative = await User.findByIdAndUpdate(id, {
        $set: { active: true, updatedAt: new Date() },
      }, { new: true });

      if (!userInative) return next(new NotFound("Usuario não encontrado."));

      await AuditLogUserService.logAction(
        "UPDATE",
        req.userId,
        id,
        [{ field: "active", oldValue: false, newValue: true }]
      );

      return res.send(userInative);
    } catch (err) {
      return next(err.message);
    }
  }

  static async inativeUser(req, res, next) {
    const { userId } = req;
    const { id } = req.params;
    try {
      if (userId === id)
        return next(new ErrorBase("Você não pode excluir a si mesmo.", 403));

      const isInativeUser = await User.findOne({ _id: id, active: false });
      if (isInativeUser !== null)
        return next(new ErrorBase("Usuario já inativo encontrado.", 400));

      const userDeleted = await User.findByIdAndUpdate(id, {
        $set: { active: false, updatedAt: new Date() },
      }, { new: true });

      if (!userDeleted) return next(new NotFound("Usuario não encontrado."));

      await AuditLogUserService.logAction(
        "DELETE",
        userId,
        id,
        [{ field: "active", oldValue: true, newValue: false }]
      );

      return res.send({ message: "Usuário inativado com sucesso." });
    } catch (err) {
      console.error(err);
      return next(err.message);
    }
  }

  static async createSupervisorPassword(req, res, next) {
    try {
      const { id } = req.params;
      const { spPassword } = req.body;

      const updatedUser = await UserService.updateSupervisorPassword(id, spPassword);

      return res.status(200).json({
        message: "Senha de supervisor atualizada com sucesso!",
        user: updatedUser,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async getAllSellers(req, res, next) {
    try {
      // 1. Encontrar as Roles de 'seller'
      const roleSellers = await Role.find({ name: { $in: ["seller_online", "seller_local"] } });

      if (!roleSellers || roleSellers.length === 0) {
        return res.status(404).send({ message: "Roles de vendedores não encontradas." });
      }

      const roleIds = roleSellers.map((role) => role._id);

      // 2. Definir o filtro para buscar usuários com as roles de seller
      const query = {
        active: true,
        Roles: { $in: roleIds },
        email: { $not: /@gf\.com$/ },
      };

      // 3. Paginação
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalUsers = await User.countDocuments(query);
      const totalPages = Math.ceil(totalUsers / limit);

      const users = await User.find(query)
        .populate({
          path: "Roles",
          match: { active: true },
          select: "name _id",
        })
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit);

      if (users.length === 0 && page === 1)
        return res.status(404).send({ message: "Não existe nenhum vendedor cadastrado ainda." });

      return res.status(200).json({
        success: true,
        data: users,
        page,
        limit,
        totalPages,
        totalCount: totalUsers,
      });

    } catch (err) {
      console.error("Erro em getAllSellers:", err);
      return res.status(500).send({ message: err.message });
    }
  }

}
