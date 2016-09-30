const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const WebsiteSchema = new Schema({
  name: String,
  url: String,
  icon_url: String,
  description: String,
  weights: Number,
  attach_visit: Number,
  recommend_by: String,
});

const Website = mongoose.model('Website', WebsiteSchema);

module.exports = Website;
