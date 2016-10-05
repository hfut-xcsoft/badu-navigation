const HttpError = require('some-http-error');
const jwt = require('../commons/jwt');
const Admin = require('../models').Admin;
const adminController = {};

adminController.authority = async ctx => {
  const username = ctx.request.body.username;
  const password = ctx.request.body.password;
  if (!username || !password) {
    throw new HttpError.BadRequestError('用户名或密码未提供');
  }
  const admin = await Admin.getAdminByUsernameAndPassword(username, password)
  if (!admin) {
    throw new HttpError.UnauthorizedError('用户名或密码错误');
  }
  const token = jwt.create({
    username: admin.username,
    user_type: 'admin'
  });
  ctx.body = {token};
};

adminController.resetPassword = async ctx => {
  const username = ctx.auth.username;
  const oldPassword = ctx.request.body.old_password;
  const newPassword = ctx.request.body.new_password;
  if (!oldPassword || !newPassword) {
    throw new HttpError.BadRequestError('请将新旧密码填写完整');
  }
  const admin = await Admin.getAdminByUsernameAndPassword(username, oldPassword);
  if (!admin) {
    throw new HttpError.BadRequestError('旧密码错误');
  }
  await Admin.resetPassword(username, newPassword);
  ctx.status = 201;
  ctx.body = true;
};

module.exports = adminController;