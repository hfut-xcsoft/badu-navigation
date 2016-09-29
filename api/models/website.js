const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const WebsiteSchema = new Schema({
  _id: ObjectId,
  name: String,
  slug: String,
  url: String,
  icon_url: String,
  description: String,
  weights: Number,
  attach_visit: Number,
});

const Website = mongoose.model('Website', WebsiteSchema);

module.exports = Website;
