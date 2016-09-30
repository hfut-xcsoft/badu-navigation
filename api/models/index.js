const mongoose = require('mongoose');
const config = require('../configs');

mongoose.Promise = Promise;

if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/badu_navigation_test');
} else {
  mongoose.connect(config.mongodb);
}
if (process.env.NODE_ENV === 'production') {
  mongoose.set('debug', true);
}

exports.Admin = require('./admin');
exports.Category = require('./category');
exports.Feedback = require('./feedback');
exports.Submit = require('./submit');
exports.Subcategory = require('./subcategory');
exports.Statistic = require('./statistic');
exports.Website = require('./website');