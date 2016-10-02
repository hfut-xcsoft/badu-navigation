const HttpError  = require('some-http-error');
const Submit = require('../models').Submit;
const easycopy = require('easy-copy');
const utils = require('../commons/utils');

const submitController = {};

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
  const status = ctx.request.body.status;
  if (!status) {
    throw new HttpError.BadRequestError('status 不存在')
  }
  const submit = await Submit.getById(submitId);
  if (!submit) {
    throw new HttpError.NotFoundError('记录未找到');
  }
  ctx.body = await submit.updateStatus(status);
  ctx.status = 201;

};

module.exports = submitController;