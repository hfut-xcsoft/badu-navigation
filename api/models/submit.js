const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const SubmitSchema = new Schema({
  time: Date,
  name: String,
  url: String,
  description: String,
  category: String,
  subcategory: String,
  email: String,
  status: Number
});

const Submit = mongoose.model('Submit', SubmitSchema);

module.exports = Submit;
