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
const subcategory1 = {
  name: '一级分类1',
  slug: 'subcategory1'
};
const subcategory2 = {
  name: '一级分类2',
  slug: 'subcategory2'
};
const website = {
  name: '测试',
  url: 'http://example.com',
  icon_url: 'http://example.com',
  description: 'test',
  weights: 100,
};

describe('Test controllers/website.js', () => {
  before(done => {
    Promise.all([
      helper.clear('categories'),
      helper.clear('subcategories'),
      helper.clear('websites')
    ]).then(() => Promise.all([
      helper.create('categories', category1),
      helper.create('categories', category2)
    ])).then(() => {
      request(app)
        .post(`/categories/${category1.slug}/subcategories`)
        .send(subcategory1)
        .expect(201)
        .expect(res => {
          subcategory1._id = res.body._id;
        })
        .end(() => {
          request(app)
            .post(`/categories/${category2.slug}/subcategories`)
            .send(subcategory2)
            .expect(201)
            .expect(res => {
              subcategory2._id = res.body._id;
            })
            .end(done)
      })
    })
  })

  describe('POST /websites', () => {
    it('create a new website', done => {
      website.subcategory = subcategory1._id;
      request(app)
        .post('/websites')
        .send(website)
        .expect(201)
        .expect(res => {
          expect(easycopy(res.body,
            ['name', 'url', 'icon_url', 'description', 'weights', 'subcategory'], {undefined: false}))
            .to.eql(website);
          website._id = res.body._id;
        })
        .end(done);
    })
  })

  describe('GET /websites', () => {
    it('get all websites', done => {
      request(app)
        .get('/websites')
        .expect(200)
        .expect(res => {
          expect(res.body).to.have.length.of(1);
          expect(res.body[0]).to.have.all.keys([
            '_id', 'name', 'url', 'icon_url', 'description', 'weights', 'subcategory', 'attach_visit'
          ])
        })
        .end(done);
    })
  })

  describe('GET /websites/:website', () => {
    it('get the new website', done => {
      request(app)
        .get(`/websites/${website._id}`)
        .expect(200)
        .end(done)
    })
    it('get 404 using a unexist website id', done => {
      request(app)
        .get(`/websites/${'a'.repeat(24)}`)
        .expect(404)
        .end(done)
    })
    it('get 404 using a string', done => {
      request(app)
        .get(`/websites/test`)
        .expect(404)
        .end(done)
    })
  })

  describe('PUT /websites/:website', () => {
    it('update subcategory', done => {
      request(app)
        .put(`/websites/${website._id}`)
        .send({subcategory: subcategory2._id})
        .expect(res => {
          expect(res.body.subcategory).to.equal(subcategory2._id)
        })
        .end(done);
    })
    it('not in subcategory1', done => {
      request(app)
        .get(`/subcategories/${subcategory1.slug}`)
        .expect(res => {
          expect(res.body.websites).to.have.length.of(0);
        })
        .end(done);
    })
    it('in subcategory2', done => {
      request(app)
        .get(`/subcategories/${subcategory2.slug}`)
        .expect(res => {
          expect(res.body.websites).to.have.length.of(1);
        })
        .end(done);
    })
  })

  describe('DELETE /websites/:website', () => {
    it('delete the website', done => {
      request(app)
        .delete(`/websites/${website._id}`)
        .expect(204)
        .end(done)
    })
    it('get 404 after delete', done => {
      request(app)
        .get(`/websites/${website._id}`)
        .expect(404)
        .end(done)
    })
    it('not in subcategory2', done => {
      request(app)
        .get(`/subcategories/${subcategory2.slug}`)
        .expect(res => {
          expect(res.body.websites).to.have.length.of(0);
        })
        .end(done);
    })
  });

  after(() => Promise.all([
      helper.clear('categories'),
      helper.clear('subcategories'),
      helper.clear('websites')
    ])
  )

});
