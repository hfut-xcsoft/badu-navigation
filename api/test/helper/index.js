const helper = {};
const mongoose = require('mongoose');
const jwt = require('../../commons/jwt');

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
    mongoose.connection.collections[collection].save(obj, (err, result) => {
      callback && callback(result);
      resolve(result);
    });
  })
};

helper.getAdminAuthority = () => {
  return {
    Authorization: 'Bearer ' + jwt.create({username: 'test', user_type: 'admin'})
  }
};

module.exports = helper;