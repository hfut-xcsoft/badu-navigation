const helper = {};
const mongoose = require('mongoose');

helper.clear = (collection, callback) => {
  mongoose.connection.collections[collection].drop( () => {
    callback();
  });
};

helper.create = (collection, obj, callback) => {
  mongoose.connection.collections[collection].save(obj, () => {
    callback();
  });
};

module.exports = helper;