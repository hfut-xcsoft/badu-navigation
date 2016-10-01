const helper = {};
const mongoose = require('mongoose');

helper.clear = (collection, callback) => {
  return new Promise((resolve, reject)  => {
    mongoose.connection.collections[collection].drop( () => {
      callback && callback();
      resolve();
    });
  })
};

helper.create = (collection, obj, callback) => {
  return new Promise((resolve, reject)  => {
    mongoose.connection.collections[collection].save(obj, result => {
      callback && callback(result);
      resolve(result);
    });
  })
};

module.exports = helper;