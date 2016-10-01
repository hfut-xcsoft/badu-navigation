const HttpError  = require('some-http-error');
const Subcategory = require('../models').Subcategory;
const Website = require('../models').Website;
const easycopy = require('easy-copy');

const websiteController = {};

websiteController.assert = async (id, ctx, next) => {
  if (/[a-f0-9]{24}/.test(id)) {
    ctx.website = await Website.getById(id);
  }
  if (!ctx.website) {
    throw new HttpError.NotFoundError('站点未找到');
  }
  await next();
};

websiteController.getWebsites = async ctx => {
  ctx.body = await Website.getByQuery()
};

websiteController.createWebsites = async ctx => {
  const body = easycopy(ctx.request.body,
    ['name', 'url', 'icon_url', 'description', 'weights', 'recommend_by', 'subcategory']);
  if (!body.name || !body.url) {
    throw new HttpError.BadRequestError('缺少必要信息')
  }
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
  let website = ctx.website;
  if (body.subcategory && body.subcategory != website.subcategory) {
    const [subcategory, targetSubcategory] = await Promise.all([
      Subcategory.getById(website.subcategory),
      Subcategory.getById(body.subcategory)
    ]);
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
    subcategory && subcategory.removeWebsite(subcategory)
  ]);
  ctx.status = 204;
  ctx.body = null;
};

module.exports = websiteController;
