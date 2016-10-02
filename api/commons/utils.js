const crypto = require('crypto');

const utils = {};
utils.md5 = (string) =>
  crypto.createHash('md5').update(string).digest('hex');

utils.isValidObjectId = (id) =>
  /^[0-9a-fA-F]{24}$/.test(id);

utils.isValidEmail = (email) =>
  /^\w[-\w\.]*@\w[-\w\.]*\.[a-zA-Z]+$/.test(email);

utils.isValidUrl = (url) =>
  /^(?:https?:\/\/)?\w[-\w\.]*\.[a-zA-Z]+$/.test(url);

utils.toNormalUrl = (url) => {
  if (!/^https?:\/\//.test(url)) {
    return 'http://' + url;
  }
  return url;
};

module.exports = utils;