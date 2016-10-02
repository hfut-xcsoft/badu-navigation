const HttpError  = require('some-http-error');
const Category = require('../models').Category;
const Subcategory = require('../models').Subcategory;
const easycopy = require('easy-copy');
const utils = require('../commons/utils');

const subcategoryController = {};

subcategoryController.assert = async (id, ctx, next) => {
  if (utils.isValidObjectId(id)) {
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
  const body = easycopy(ctx.request.body,
    ['name', 'slug', 'icon_url', 'description', 'weights', 'category']);
  if (!body.name || !body.slug || !body.category) {
    throw new HttpError.BadRequestError('缺少必要信息');
  }
  const category = await Category.getById(body.category);
  if (!category) {
    throw new HttpError.NotFoundError('一级分类未找到');
  }
  body.category = category._id;
  const subcategory = await new Subcategory(body).create();
  await category.pushSubcategory(subcategory);
  ctx.status = 201;
  ctx.body = subcategory;
};

subcategoryController.getSubcategories = async ctx => {
  const query = {};
  if (ctx.request.query.category) {
    query.category = ctx.request.query.category;
  }
  ctx.body = await Subcategory.getByQuery(query);
};

subcategoryController.getSubcategory = async ctx => {
  ctx.body = ctx.subcategory;
};

subcategoryController.updateSubcategory = async ctx => {
  'use strict';
  const body = easycopy(ctx.request.body,
    ['name', 'slug', 'icon_url', 'description', 'weights', 'category'],
    { undefined: false }
  );
  let subcategory = ctx.subcategory;
  if (body.category && body.category != subcategory.category) {
    const result = await Promise.all([
      Category.getById(subcategory.category),
      Category.getById(body.category)
    ]);
    const category = result[0];
    const targetCategory = result[1];
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


