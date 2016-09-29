const mongoose = require('mongoose');
const config = require('../configs');
if (process.env.NODE_ENV === 'test') {
  mongoose.connect('navigation_test');
} else {
  mongoose.connect(config.mongodb);
}
if (process.env.NODE_ENV === 'production') {
  mongoose.set('debug', true);
}