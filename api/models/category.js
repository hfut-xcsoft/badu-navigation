const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CategorySchema = new Schema({
  name: String,
  slug: String,
  icon_url: String,
  description: String,
  weights: Number,
  subcategories: [{ type: ObjectId, ref: 'Subcategory' }]
});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
