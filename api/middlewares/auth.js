const jwt = require('../commons/jwt');
const HttpError = require('some-http-error');
const auth = {};

auth.verify = async (ctx, next) => {
  'use strict';
  const authHeader = ctx.request.header['authorization'];
  const auth = ctx.auth = {isAuth: false, isAdmin: false, message: 'Unauthorized'};
  if (!authHeader) {
    return await next();
  }

  const token = authHeader.split(' ')[1];
  if (authHeader.split(' ')[0] != 'Bearer' || !token) {
    auth.message = "Authorization type error";
    return await next();
  }

  let obj = {};
  try {
    obj = await jwt.verify(token);
  } catch (err) {
    auth.message = err.message;
    return await next();
  }
  auth.isAuth = true;
  auth.isAdmin = obj.user_type === 'admin';
  auth.username = obj.username;
  delete auth.message;
  await next();
};

auth.adminRequired = async (ctx, next) => {
  if (process.env.NODE_ENV === 'test') {
    return await next();
  }
  if (!ctx.auth.isAuth) {
    throw new HttpError.UnauthorizedError(ctx.auth.message);
  } else if (!ctx.auth.isAdmin) {
    throw new HttpError.ForbiddenError('Access Denied');
  } else {
    await next();
  }
};

module.exports = auth;