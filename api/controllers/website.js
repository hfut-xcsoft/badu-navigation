const HttpError  = require('some-http-error');
const Subcategory = require('../models').Subcategory;
const Website = require('../models').Website;
const easycopy = require('easy-copy');
const utils = require('../commons/utils');

const websiteController = {};

websiteController.assert = async (id, ctx, next) => {
  if (utils.isValidObjectId(id)) {
    ctx.website = await Website.getById(id);
  }
  if (!ctx.website) {
    throw new HttpError.NotFoundError('站点未找到');
  }
  await next();
};

websiteController.getWebsites = async ctx => {
  const query = {};
  if (ctx.request.query.subcategory) {
    query.subcategory = ctx.request.query.subcategory
  }
  ctx.body = await Website.getByQuery(query)
};

websiteController.createWebsites = async ctx => {
  const body = easycopy(ctx.request.body,
    ['name', 'url', 'icon_url', 'description', 'weights', 'recommend_by', 'subcategory']);
  if (!body.name || !body.url) {
    throw new HttpError.BadRequestError('缺少必要信息')
  }
  if (!utils.isValidUrl(body.url)) {
    throw new HttpError.BadRequestError('网站 URL 地址格式不正确');
  }
  body.url = utils.toNormalUrl(body.url);
  const website = await new Website(body).create();
  if (body.subcategory) {
    const subcategory = await Subcategory.getById(body.subcategory);
    subcategory && await subcategory.pushWebsite(website);
  }
  ctx.status = 201;
  ctx.body = website;
};

websiteController.getWebsite = async ctx => {
  ctx.body = ctx.website;
};

websiteController.updateWebsite = async ctx => {
  'use strict';
  const body = easycopy(ctx.request.body,
    ['name', 'url', 'icon_url', 'description', 'weights', 'recommend_by', 'subcategory'],
    { undefined: false });
  if (body.url) {
    if (!utils.isValidUrl(body.url)) {
      throw new HttpError.BadRequestError('网站 URL 地址格式不正确');
    }
    body.url = utils.toNormalUrl(body.url);
  }
  let website = ctx.website;
  if (body.subcategory && body.subcategory != website.subcategory) {
    const result = await Promise.all([
      Subcategory.getById(website.subcategory),
      Subcategory.getById(body.subcategory)
    ]);
    const subcategory = result[0];
    const targetSubcategory = result[1];
    await Promise.all([
      subcategory && subcategory.removeWebsite(website),
      targetSubcategory && targetSubcategory.pushWebsite(website)
    ]);
  }
  ctx.status = 201;
  ctx.body = await ctx.website.update(body);
};

websiteController.removeWebsite = async ctx => {
  const website = ctx.website;
  const subcategory = await Subcategory.getById(website.subcategory);
  await Promise.all([
    website.delete(),
    subcategory && subcategory.removeWebsite(website)
  ]);
  ctx.status = 204;
  ctx.body = null;
};

module.exports = websiteController;
