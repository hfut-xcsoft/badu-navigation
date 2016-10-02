const HttpError  = require('some-http-error');
const Category = require('../models').Category;
const easycopy = require('easy-copy');
const utils = require('../commons/utils');

const categoryController = {};

categoryController.assert = async (id, ctx, next) => {
  if (utils.isValidObjectId(id)) {
    ctx.category = await Category.getById(id);
  } else {
    ctx.category = await Category.getBySlug(id);
  }
  if (!ctx.category) {
    throw new HttpError.NotFoundError('分类未找到');
  }
  await next();
};

categoryController.createCategory = async ctx => {
  const body = easycopy(ctx.request.body,
    ['name', 'slug', 'icon_url', 'description', 'weights']);
  if (!body.name || !body.slug) {
    throw new HttpError.BadRequestError('缺少必要信息');
  }
  const category = await new Category(body).save();
  ctx.status = 201;
  ctx.body = category;
};

categoryController.getCategories = async ctx => {
  ctx.body = await Category.getByQuery();
};

categoryController.getCategory = async ctx => {
  ctx.body = ctx.category;
};

categoryController.updateCategory = async ctx => {
  const body = easycopy(ctx.request.body,
    ['name', 'slug', 'icon_url', 'description', 'weights'],
    { undefined: false }
  );
  const category = await ctx.category.update(body);
  ctx.status = 201;
  ctx.body = category;
};

categoryController.removeCategory = async ctx => {
  await ctx.category.delete();
  ctx.status = 204;
  ctx.body = null;
};

module.exports = categoryController;


