const expect = require('chai').expect;
const request = require('supertest');
const helper = require('../helper');
const app = require('../../index');
const easycopy = require('easy-copy');

const category = {
  name: '测试',
  slug: 'test',
  icon_url: 'http://example.com',
  description: '测试',
  weights: 100
};
describe('Test controllers/category.js', () => {
  before(done => {
    helper.clear('categories', done);
  });
  describe('POST /categories', () => {
    it('create category', done => {
      request(app)
        .post('/categories')
        .send(category)
        .expect(201)
        .expect(res => {
          expect(easycopy(res.body,
            ['name', 'slug', 'icon_url', 'description', 'weights'], {undefined: false}))
            .to.eql(category);
        })
        .end(done);
    })
  });

  describe('GET /categories', () => {
    it('get categories', done => {
      request(app)
        .get('/categories')
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length.of(1);
          expect(res.body[0]).to.have.all.keys([
            '_id', 'name', 'slug', 'icon_url', 'description', 'weights', 'subcategories'
          ]);
          category._id = res.body[0]._id;
        })
        .end(done);
    })
  })

  describe('GET /categories/:category', () => {
    it('get the category by slug', done => {
      request(app)
        .get(`/categories/${category.slug}`)
        .expect(200)
        .end(done)
    });
    it('get the category by id', done => {
      request(app)
        .get(`/categories/${category._id}`)
        .expect(200)
        .end(done);
    })
    it('get 404 using a unexist slug', done => {
      request(app)
        .get(`/categories/404`)
        .expect(404)
        .end(done)
    })
  });

  describe(`PUT /categories/:category`, () => {
    it('update category info', done => {
      request(app)
        .put(`/categories/${category.slug}`)
        .send({ weights: 30 })
        .expect(201)
        .expect(res => {
          expect(res.body.weights).to.equal(30);
          expect(res.body.name).to.equal(category.name)
        })
        .end(done)
    })
  });

  describe(`DELETE /categories/:category`, () => {
    it('delete the category', done => {
      request(app)
        .delete(`/categories/${category.slug}`)
        .expect(204)
        .end(done);
    });
    it('get 404 after delete', done => {
      request(app)
        .get(`/categories/${category.slug}`)
        .expect(404)
        .end(done)
    })
  });

  after(done => helper.clear('categories', done))

});

