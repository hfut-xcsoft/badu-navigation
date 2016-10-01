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
  status: Number,
  __v: { type: Number,  select: false }
});

SubmitSchema.methods = {
  create: function () {
    return this.save();
  },
  updateStatus: function (status) {
    this.status = status;
    return this.save();
  }
}

SubmitSchema.statics = {
  getByQuery: function (query, opt) {
    return this.find(query, {}, opt).exec();
  },
  getById: function (id) {
    return this.findById(id).exec();
  }
}

const Submit = mongoose.model('Submit', SubmitSchema);

module.exports = Submit;
