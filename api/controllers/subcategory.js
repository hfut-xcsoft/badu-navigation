const HttpError  = require('some-http-error');
const Category = require('../models').Category;
const Subcategory = require('../models').Subcategory;
const easycopy = require('easy-copy');

const subcategoryController = {};

subcategoryController.assert = async (id, ctx, next) => {
  if (/[a-f0-9]{24}/.test(id)) {
    ctx.subcategory = await Subcategory.getById(id);
  } else {
    ctx.subcategory = await Subcategory.getBySlug(id);
  }
  if (!ctx.subcategory) {
    throw new HttpError.NotFoundError('分类未找到');
  }
  await next();
};

subcategoryController.createSubcategory = async ctx => {
  const category = ctx.category;
  if (!category) {
    throw new HttpError.NotFoundError('一级分类未找到');
  }
  const body = easycopy(ctx.request.body,
    ['name', 'slug', 'icon_url', 'description', 'weights']);
  if (!body.name || !body.slug) {
    throw new HttpError.BadRequestError('缺少必要信息');
  }
  body.category = category._id;
  const subcategory = await new Subcategory(body).create();
  await category.pushSubcategory(subcategory);
  ctx.status = 201;
  ctx.body = subcategory;
};

subcategoryController.getSubcategories = async ctx => {
  if (ctx.category) {
    ctx.body = ctx.category.subcategories;
  } else {
    ctx.body = await Subcategory.getByQuery();
  }
};

subcategoryController.getSubcategory = async ctx => {
  ctx.body = ctx.subcategory;
};

subcategoryController.updateSubcategory = async ctx => {
  const body = easycopy(ctx.request.body,
    ['name', 'slug', 'icon_url', 'description', 'weights', 'category'],
    { undefined: false }
  );
  let subcategory = ctx.subcategory;
  if (body.category && body.category != subcategory.category) {
    const [category, targetCategory] = await Promise.all([
      Category.getById(subcategory.category),
      Category.getById(body.category)
    ]);
    if (!targetCategory) {
      throw new HttpError.NotFoundError('分类不存在');
    }
    await Promise.all([
      category.removeSubcategory(subcategory),
      targetCategory.pushSubcategory(subcategory)
    ])
  }
  subcategory = await ctx.subcategory.update(body);
  ctx.status = 201;
  ctx.body = subcategory;
};

subcategoryController.removeSubcategory = async ctx => {
  const subcategory = ctx.subcategory;
  const category = await Category.getById(subcategory.category);
  if (!category) {
    throw new HttpError.NotFoundError('一级分类不存在');
  }
  await Promise.all([
    subcategory.delete(),
    category.removeSubcategory(subcategory)
  ]);
  ctx.status = 204;
  ctx.body = null;
};

module.exports = subcategoryController;


