const HttpError = require('some-http-error');

const errorHandling = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof HttpError) {
      ctx.status = err.statusCode;
    } else {
      ctx.status = 500;
      if (process.env.NODE_ENV !== 'test') {
        console.log(err.stack);
      }
    }
    ctx.body = {
      statusCode: ctx.status,
      message: err.message
    };
  }
};

module.exports = errorHandling;
