require('babel-register')();
const expect = require('chai').expect;
const HttpError = require('some-http-error');
const errorHandling = require('../../middlewares').errorHandling;

describe('Test middlewares/error-handling.js', () => {

  const asyncfy = (func) => {
    return new Promise(resolve => {
      func();
      setTimeout(() => {
        resolve();
      }, 0)
    })
  }
  it('Async 200', async () => {
    const ctx = {};
    const next = async () => {
      await asyncfy(() => {
        ctx.status = 200;
      });
    };
    await errorHandling(ctx, next);
    expect(ctx.status).to.equal(200);
    expect(ctx.body).to.be.undefined;
  });
  it('Sync Http Error', async () => {
    const ctx = {};
    const next = () => {
      throw new HttpError(400, 'BadRequest');
    };
    await errorHandling(ctx, next);
    expect(ctx.status).to.equal(400);
    expect(ctx.body.statusCode).to.equal(400);
    expect(ctx.body.message).to.equal('BadRequest');
  });
  it('Async Http Error', async () => {
    const ctx = {};
    const next = async () => {
      await asyncfy(() => {
        throw new HttpError(400, 'BadRequest');
      })
    };
    await errorHandling(ctx, next);
    expect(ctx.status).to.equal(400);
    expect(ctx.body.statusCode).to.equal(400);
    expect(ctx.body.message).to.equal('BadRequest');
  });
  it('Server error', async () => {
    const ctx = {};
    const next = async () => {
      throw new Error('Test');
    };
    await errorHandling(ctx, next);
    expect(ctx.status).to.equal(500);
    expect(ctx.body.statusCode).to.equal(500);
    expect(ctx.body.message).to.equal('Test');
  })
});
