const crypto = require('crypto');

const utils = {};
utils.md5 = (string) =>
  crypto.createHash('md5').update(string).digest('hex');

utils.isValidObjectId = (id) =>
  /^[0-9a-fA-F]{24}$/.test(id);

utils.isValidEmail = (email) =>
  /^\w[-\w\.]*@\w[-\w\.]*\.[a-zA-Z]+$/.test(email);

utils.isValidUrl = (url) =>
  /^(?:https?:\/\/)?(\w[-\w\.]*\.[a-zA-Z]+|(\d{1,3}\.){3}\d{1,3})\/?/.test(url);

utils.toNormalUrl = (url) => {
  if (!/^https?:\/\//.test(url)) {
    return 'http://' + url;
  }
  return url;
};

utils.dateFormat = (date) => {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const yyyy = date.getFullYear();
  const d = date.getDate();
  const m = date.getMonth() + 1;
  const mm = m  < 10 ? '0' + m : m;
  const dd = d  < 10 ? '0' + d : d;
  return  `${yyyy} 年 ${mm} 月 ${dd} 日`;
}

module.exports = utils;
