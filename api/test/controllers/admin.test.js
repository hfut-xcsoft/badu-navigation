const expect = require('chai').expect;
const request = require('supertest');
const helper = require('../helper');
const app = require('../../app');
const utils = require('../../commons/utils');
const adminController = require('../../controllers/admin');

const agent = request.agent(app);

describe('controllers/admin.js', () => {
  before(() => helper.create('admins', {
    username: 'test',
    password: utils.md5('123')
  }));

  describe('POST /admins/authorization', () => {

    it('get 401 using invalid login info', done => {
      agent
        .post('/admins/authorization')
        .send({username: 'test', password: '1234'})
        .expect(401)
        .end(done);
    });
    it('get token using valid info', done => {
      agent
        .post('/admins/authorization')
        .send({username: 'test', password: '123'})
        .expect(200)
        .expect(res => {
          expect(res.body.token).to.be.a('string');
        })
        .end(done);
    });
  });

  describe('PUT /admins/password', () => {
    it('reset failed using invalid old password', done => {
      agent
        .put('/admins/password')
        .set(helper.getAdminAuthority())
        .send({old_password: '000', new_password: '456'})
        .expect(400)
        .end(done);
    });

    it('reset successful using valid old password', done => {
      agent
        .put('/admins/password')
        .set(helper.getAdminAuthority())
        .send({old_password: '123', new_password: '123456'})
        .expect(201)
        .expect(res => {
          expect(res.body).to.equal(true);
        })
        .end(done);
    })
  });

  after(() => helper.clear('admins'));
});