const expect = require('chai').expect;
const request = require('supertest');
const helper = require('../helper');
const app = require('../../index');
const Statistic = require('../../models').Statistic;

describe('Test controllers/statistic.js', () => {

  before(() => helper.clear('statistics'));
  describe('POST /statistics', () => {

    it('add click count if this is the first click of all in this day', done => {
      const websiteId = 'a'.repeat(24);
      request(app)
        .post(`/statistics?type=click&id=${websiteId}`)
        .expect(201)
        .end(() => {
          Statistic.find({"websites.website": websiteId}, (err, statistics) => {
            expect(statistics).to.have.length.of(1);
            expect(statistics[0].websites).to.have.length.of(1);
            expect(statistics[0].websites[0].website.toString()).to.equal(websiteId);
            expect(statistics[0].websites[0].count).to.equal(1);
            done();
          })
        })
    })
    it('add click count if this is the website\'s first click in this day', done => {
      const websiteId = 'b'.repeat(24);
      request(app)
        .post(`/statistics?type=click&id=${websiteId}`)
        .expect(201)
        .end(() => {
          Statistic.find({"websites.website": websiteId}, (err, statistics) => {
            expect(statistics).to.have.length.of(1);
            expect(statistics[0].websites).to.have.length.of(2);
            expect(statistics[0].websites[1].website.toString()).to.equal(websiteId);
            expect(statistics[0].websites[1].count).to.equal(1);
            done();
          })
        })
    })
    it('add click count if this is the website\'s second click in this day', done => {
      const websiteId = 'b'.repeat(24);
      request(app)
        .post(`/statistics?type=click&id=${websiteId}`)
        .expect(201)
        .end(() => {
          Statistic.find({"websites.website": websiteId}, (err, statistics) => {
            expect(statistics).to.have.length.of(1);
            expect(statistics[0].websites).to.have.length.of(2);
            expect(statistics[0].websites[1].website.toString()).to.equal(websiteId);
            expect(statistics[0].websites[1].count).to.equal(2);
            done();
          })
        })
    })
  });
  after(() => helper.clear('statistics'));

})
