const expect = require('chai').expect;
const request = require('supertest');
const helper = require('../helper');
const app = require('../../index');

describe('Test controllers/submit.js', () => {
  before(() => helper.clear('submits'));
  const submit = {
    name: "新网站",
    url: "http://example.com",
    description: "这个网站好棒",
    category: "其它",
    email: "example@example.com"
  };
  describe('POST /submits', () => {
    it('get error if there is no url in request', done => {
      request(app)
        .post('/submits')
        .send({url: ''})
        .expect(400)
        .end(done);
    })
    it('create successfully', done => {
      request(app)
        .post('/submits')
        .send(submit)
        .expect(201)
        .end(done);
    })
  });
  describe('GET /submits', () => {
    it('get the created submits', done => {
      request(app)
        .get('/submits')
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length.of(1);
          expect(res.body[0]).to.have.all.keys([
            '_id', 'time', 'name', 'url', 'description', 'category', 'email', 'status'
          ]);
          submit._id = res.body[0]._id;
        })
        .end(done);
    })
  });
  describe('PUT /submits/:submit', () => {
    it('get 404 if status is not exist', done => {
      request(app)
        .put(`/submits/${submit._id}`)
        .expect(400)
        .end(done);
    });
    it('get 304 with same status', done => {
      request(app)
        .put(`/submits/${submit._id}`)
        .send({status: 0})
        .expect(304)
        .end(done);
    });
    it('update submit status successfully', done => {
      request(app)
        .put(`/submits/${submit._id}`)
        .send({status: 1})
        .expect(201)
        .expect(res => {
          expect(res.body.status).to.equal(1);
        })
        .end(done);
    });
    it('get 400 if update submit status to 3 with no enough info', done => {
      request(app)
        .put(`/submits/${submit._id}`)
        .send({status: 3})
        .expect(400)
        .end(done);
    });
    it('get 400 if subcategory is not existed', done => {
      request(app)
        .put(`/submits/${submit._id}`)
        .send({status: 3, url: 'http://example.com', name: 'example', subcategory: 'a'.repeat(24)})
        .expect(400)
        .end(done);
    });
  });

  after(() => Promise.all([
    helper.clear('submits'),
    helper.clear('websites')
  ]));
});