import ErrorBase from "../../errors/base.error.js";
import NotFound from "../../errors/notFound.error.js";
import CategoryService from "./category.service.js";
import Category from "./schemas/category.schema.js";
import AuditLogCategoryService from "../category/log/service/auditLogCategory.service.js";

export default class CategoryController {
  static async getAll(req, res, next) {
    let { limit = 10, page = 1 } = req.query;
    try {
      req.query.ordenacao = 'name:1';
      const categories = await CategoryService.paginable(req.query);

      const totalItems = categories.length;
      const totalPages = Math.ceil(totalItems / limit);

      const response = {
        data: categories,
        totalItems,
        totalPages,
        currentPage: page,
        limit,
      };

      res.send(response);
    } catch (err) {
      console.error(err);
      if (err.message === "Nenhuma categoria cadastrada.") {
        return next(new NotFound("Nenhuma categoria cadastrada."));
      }
      return next(err.message);
    }
  }

  static async getAllList(req, res, next) {
    try {
      const categories = await Category.find({ active: true }).sort({ name: 1 });

      if (categories.length < 1) {
        return next(new NotFound("Nenhuma categoria cadastrada."));
      }

      res.send(categories);
    } catch (err) {
      return next(err.message);
    }
  }

  static async getById(req, res, next) {
    const { id } = req.params;
    try {
      const category = await Category.findOne({
        _id: id,
        active: true,
      });

      if (!category) {
        return next(new NotFound("Categoria não cadastrada."));
      }

      return res.send(category);
    } catch (err) {
      return next(err.message);
    }
  }

  static async create(req, res, next) {
    const { name } = req.body;
    const categoryReceived = {
      ...req.body,
      createdBy: req.userId,
    };
    try {
      const isCategoryExisted = await Category.find({ name });

      if (isCategoryExisted.length > 0) {
        return next(new ErrorBase("Conflito em Categoria já existente", 409));
      }

      const newCategory = new Category(categoryReceived);
      await newCategory.save();

      await AuditLogCategoryService.logAction(
        "CREATE",
        req.userId,
        newCategory._id,
        [],
        "Category"
      );

      res.send(newCategory);
    } catch (err) {
      return next(err);
    }
  }

  static async update(req, res, next) {
    const { id } = req.params;
    const { name } = req.body;
    const categoryReceived = {
      $set: {
        ...req.body,
        updateAt: new Date(),
        updateBy: req.userId,
      },
    };
    try {
      const isCategoryExisted = await Category.findById(id);

      if (!isCategoryExisted) {
        return next(new NotFound("Categoria não encontrada."));
      }

      const isCategoryExistedName = await Category.find({ name });

      if (isCategoryExistedName.length > 0) {
        return next(new ErrorBase("Conflito em Categoria já existente", 409));
      }

      const oldCategoryData = { ...isCategoryExisted.toObject() };

      const CategoryUpdated = await Category.findByIdAndUpdate(
        id,
        categoryReceived
      );
      await CategoryUpdated.save();
      const category = await Category.findById(id);

      const changes = await AuditLogCategoryService.getChanges(
        oldCategoryData,
        category.toObject()
      );
      await AuditLogCategoryService.logAction(
        "UPDATE",
        req.userId,
        id,
        changes,
        "Category"
      );

      res.send(category);
    } catch (err) {
      return next(err);
    }
  }

  static async reative(req, res, next) {
    const { id } = req.params;

    try {
      const isDeletedCategory = await Category.findOne({
        _id: id,
        active: true,
      });

      if (isDeletedCategory !== null) {
        return next(new ErrorBase(`Categoria já está ativa.`, 400));
      }

      const categoryInative = await Category.findByIdAndUpdate(id, {
        $set: { active: true, updatedAt: new Date(), updatedBy: req.userId },
      });
      await categoryInative.save();

      await AuditLogCategoryService.logAction(
        "REACTIVATE",
        req.userId,
        id,
        [{ field: "active", oldValue: false, newValue: true }],
        "Category"
      );

      return res.send({
        message: `Categoria ${categoryInative.name} reativado.`,
      });
    } catch (err) {
      return next(err);
    }
  }

  static async inative(req, res, next) {
    const { id } = req.params;

    try {
      const isActiveCategory = await Category.findOne({
        _id: id,
        active: false,
      });

      if (isActiveCategory !== null) {
        return next(new ErrorBase(`Categoria já está inativada.`, 400));
      }
      const categoryInative = await Category.findByIdAndUpdate(id, {
        $set: { active: false, updatedAt: new Date(), updatedBy: req.userId },
      });
      await categoryInative.save();

      await AuditLogCategoryService.logAction(
        "INACTIVATE",
        req.userId,
        id,
        [{ field: "active", oldValue: true, newValue: false }],
        "Category"
      );

      return res.send({
        message: `Categoria ${categoryInative.name} inativado.`,
      });
    } catch (err) {
      return next(err);
    }
  }
}
