const expect = require('chai').expect;
const utils = require('../../commons/utils');
describe('common/utils.js', () => {
  describe('utils.md5', () => {
    it('create right md5 hash', () => {
      expect(utils.md5('123456')).to.equal('e10adc3949ba59abbe56e057f20f883e')
    })
  })
})