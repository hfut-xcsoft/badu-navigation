const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const RecommendSchema = new Schema({
  time: Date,
  name: String,
  url: String,
  description: String,
  category: { type: ObjectId, ref: 'Category' },
  subcategory: { type: Object, ref: 'Subcategory' },
  email: String,
  status: Number
});

const Recommend = mongoose.model('Recommend', RecommendSchema);

module.exports = Recommend;
