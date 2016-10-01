const HttpError  = require('some-http-error');
const Submit = require('../models').Submit;
const easycopy = require('easy-copy');

const submitController = {};

submitController.createSubmit = async ctx => {
  const body = easycopy(ctx.request.body,
    ['name', 'url', 'description', 'category', 'subcategory', 'email']);
  Object.keys(body).forEach(key => {
    if (!body[key]) {
      throw new HttpError.BadRequestError('请将信息填写完整');
    }
  });
  await new Submit(body).create();
  ctx.body = true;
  ctx.status = 201;
};

submitController.getAllSubmits = async ctx => {
  ctx.body = await Submit.getByQuery();
};

submitController.updateSubmitStatus = async ctx => {
  const submitId = ctx.params.submit;
  if (!/[0-9a-f]{24}/.test(submitId)) {
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