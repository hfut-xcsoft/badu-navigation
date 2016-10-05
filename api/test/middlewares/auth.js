require('babel-register')();
const expect = require('chai').expect;
const authMiddleware = require('../../middlewares/auth');
const helper = require('../helper');

describe('Test middlewares/auth', () => {

  const next = () => {};
  describe('Test auth.verify middleware', ()=> {
    it('should be unauthorized without authorization header', async () => {
      const ctx = {
        request: {
          header: {}
        }
      };
      await authMiddleware.verify(ctx, next);
      expect(ctx.auth.isAuth).to.be.false;
      expect(ctx.auth.message).to.equal('Unauthorized');
    });
    it('should be error with a wrong authorization header', async () => {
      const ctx = {
        request: {
          header: {
            'authorization': 'test'
          }
        }
      };
      await authMiddleware.verify(ctx, next);
      expect(ctx.auth.isAuth).to.be.false;
      expect(ctx.auth.message).to.equal('Authorization type error');
    });
    it('should be authorized with a valid admin user', async () => {
      const ctx = {
        request: {
          header: {
            authorization: helper.getAdminAuthority().Authorization
          }
        }
      };
      await authMiddleware.verify(ctx, next);
      expect(ctx.auth.message).to.be.undefined;
      expect(ctx.auth.isAuth).to.be.true;
      expect(ctx.auth.isAdmin).to.be.true;
      expect(ctx.auth.username).to.equal('test');
    });
    it('should be error with a wrong token', async () => {
      const ctx = {
        request: {
          header: {
            authorization: 'Bearer ' + 'test'
          }
        }
      };
      await authMiddleware.verify(ctx, next);
      expect(ctx.auth.isAuth).to.be.false;
      expect(ctx.auth.message).to.equal('jwt malformed');
    });
  });

  describe('Test auth.adminRequire middleware', () => {
    it('should be ok with admin authority', async () => {
      const ctx = {
        auth: {
          isAuth: true,
          isAdmin: true
        }
      };
      await authMiddleware.adminRequired(ctx, next);
    });
    it('should be an ForbiddenError with unAdmin authority', async () => {
      const ctx = {
        auth: {
          isAuth: true,
          isAdmin: false
        }
      };
      try  {
        await authMiddleware.adminRequired(ctx, next);
      } catch (err) {
        expect(err.message).to.equal('Access Denied');
      }
    });
    it('should be an Unauthorized without authorized', async () => {
      const ctx = {
        auth: {
          isAuth: false
        }
      };
      try {
        await authMiddleware.adminRequired(ctx, next);
      } catch (err) {
        expect(err.message).to.equal('Unauthorized');
      }
    });
  });
});