const crypto = require('crypto');

const utils = {};
utils.md5 = (string) =>
  crypto.createHash('md5').update(string).digest('hex');

module.exports = utils;