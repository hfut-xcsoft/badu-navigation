const expect = require('chai').expect;
const request = require('supertest');
const helper = require('../helper');
const app = require('../../index');
const easycopy = require('easy-copy');

const category1 = {
  name: '一级分类1',
  slug: 'category1'
};
const category2 = {
  name: '一级分类2',
  slug: 'category2'
};
const subcategory = {
  name: '测试',
  slug: 'test',
  icon_url: 'http://example.com',
  description: '测试',
  weights: 100
};
describe('Test controllers/subcategory.js', () => {
  before(done => {
    Promise.all([
      helper.clear('categories'),
      helper.clear('subcategories')
    ]).then(() => {
      return Promise.all([
        helper.create('categories', category1),
        helper.create('categories', category2)
      ]);
    }).then(() => done())
  });
  describe('POST /categories/:category/subcategories', () => {
    it('create subcategory', done => {
      request(app)
        .post(`/categories/${category1.slug}/subcategories`)
        .send(subcategory)
        .expect(201)
        .expect(res => {
          expect(easycopy(res.body,
            ['name', 'slug', 'icon_url', 'description', 'weights'], {undefined: false}))
            .to.eql(subcategory);
        })
        .end(done);
    })
    it('in category1', done => {
      request(app)
        .get(`/categories/${category1.slug}`)
        .expect(res => {
          expect(res.body.subcategories).to.have.length.of(1);
          category1._id = res.body._id;
        })
        .end(done);
    })
    it('not in category2', done => {
      request(app)
        .get(`/categories/${category2.slug}`)
        .expect(res => {
          expect(res.body.subcategories).to.have.length.of(0);
          category2._id = res.body._id;
        })
        .end(done);
    })
  });

  describe('GET /subcategories', () => {
    it('get subcategories', done => {
      request(app)
        .get('/subcategories')
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length.of(1);
          expect(res.body[0]).to.have.all.keys([
            '_id', 'name', 'slug', 'icon_url', 'description', 'weights', 'websites', 'category'
          ]);
          subcategory._id = res.body[0]._id;
        })
        .end(done);
    })
  });

  describe('GET /subcategories/:subcategory', () => {
    it('get the subcategory by slug', done => {
      request(app)
        .get(`/subcategories/${subcategory.slug}`)
        .expect(200)
        .end(done)
    });
    it('get the subcategory by id', done => {
      request(app)
        .get(`/subcategories/${subcategory._id}`)
        .expect(200)
        .end(done);
    })
    it('get 404 using a unexist slug', done => {
      request(app)
        .get(`/subcategories/404`)
        .expect(404)
        .end(done)
    })
  });

  describe(`PUT /subcategories/:subcategory`, () => {
    it('update subcategory info', done => {
      request(app)
        .put(`/subcategories/${subcategory.slug}`)
        .send({ weights: 30 })
        .expect(201)
        .expect(res => {
          expect(res.body.weights).to.equal(30);
          expect(res.body.name).to.equal(subcategory.name)
        })
        .end(done)
    })
    it('update category', done => {
      request(app)
        .put(`/subcategories/${subcategory.slug}`)
        .send({category: category2._id})
        .expect(201)
        .expect(res => {
          expect(res.body.category).to.equal(category2._id);
        })
        .end(done);
    })
    it('not in category1', done => {
      request(app)
        .get(`/categories/${category1.slug}`)
        .expect(res => {
          expect(res.body.subcategories).to.have.length.of(0);
        })
        .end(done);
    })
    it('in category2', done => {
      request(app)
        .get(`/categories/${category2.slug}`)
        .expect(res => {
          expect(res.body.subcategories).to.have.length.of(1);
        })
        .end(done);
    })
  });

  describe('DELETE /subcategories/:subcategory', () => {
    it('delete the subcategory', done => {
      request(app)
        .delete(`/subcategories/${subcategory.slug}`)
        .expect(204)
        .end(done);
    });
    it('get 404 after delete', done => {
      request(app)
        .get(`/subcategories/${subcategory.slug}`)
        .expect(404)
        .end(done)
    })
    it('not in category2', done => {
      request(app)
        .get(`/categories/${category2.slug}`)
        .expect(res => {
          expect(res.body.subcategories).to.have.length.of(0);
        })
        .end(done);
    })
  });

  after(done => {
    Promise.all([
      helper.clear('categories'),
      helper.clear('subcategories')
    ]).then(() => done())
  })

});

