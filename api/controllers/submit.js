const HttpError  = require('some-http-error');
const Submit = require('../models').Submit;
const Category = require('../models').Category;
const Subcategory = require('../models').Subcategory;
const Website = require('../models').Website;
const easycopy = require('easy-copy');
const utils = require('../commons/utils');
const mailUtil = require('../commons/mail');

const submitController = {};

const SUBMIT_STATE = {
  UNPROCESSED: 0,
  REJECTED: 1,
  CANDIDATE: 2,
  RESOLVED: 3
};

submitController.createSubmit = async ctx => {
  const body = easycopy(ctx.request.body,
    ['name', 'url', 'description', 'category', 'email']);
  Object.keys(body).forEach(key => {
    if (!body[key]) {
      throw new HttpError.BadRequestError('请将信息填写完整');
    }
  });
  if (!utils.isValidUrl(body.url)) {
    throw new HttpError.BadRequestError('网站 URL 地址格式不正确');
  }
  if (!utils.isValidEmail(body.email)) {
    throw new HttpError.BadRequestError('邮箱格式不正确');
  }
  body.url = utils.toNormalUrl(body.url);
  await new Submit(body).create();
  ctx.body = true;
  ctx.status = 201;
};

submitController.getAllSubmits = async ctx => {
  ctx.body = await Submit.getByQuery();
};

submitController.updateSubmitStatus = async ctx => {
  const submitId = ctx.params.submit;
  if (!utils.isValidObjectId(submitId)) {
    throw new HttpError.BadRequestError('请输入合法 ID');
  }
  const body = easycopy(ctx.request.body,
    ['status', 'name', 'url', 'icon_url', 'description', 'weights', 'subcategory', 'category']);
  if (typeof body.status === 'undefined') {
    throw new HttpError.BadRequestError('status 不存在')
  }
  const submit = await Submit.getById(submitId);
  if (!submit) {
    throw new HttpError.NotFoundError('记录未找到');
  }
  if (submit.status == body.status) {
    ctx.status = 304;
    return;
  }

  if (body.status == SUBMIT_STATE.RESOLVED) {
    if (!body.category || !body.subcategory) {
      throw new HttpError.BadRequestError('请将要收录的分类信息填写完整');
    }
    if (!body.name || !body.url) {
      throw new HttpError.BadRequestError('缺少必要信息')
    }
    body.recommend_by = submit.email;
    body.url = utils.toNormalUrl(body.url);

    // Add website
    Promise.all([
      new Website(body).create(),
      Category.getById(body.category),
      Subcategory.getById(body.subcategory)
    ]).then(results => {
      const website = results[0];
      const category = results[1];
      const subcategory = results[2];
      subcategory && subcategory.pushWebsite(website);
      mailUtil.sendTestimonialToSubmit(submit, website, category, subcategory);
    })
  }
  ctx.body = await submit.updateStatus(body.status);
  ctx.status = 201;
};

module.exports = submitController;