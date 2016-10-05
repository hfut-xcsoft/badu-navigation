const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const WebsiteSchema = new Schema({
  name: String,
  url: String,
  icon_url: String,
  description: String,
  weights: { type: Number, default: 0 },
  subcategory: ObjectId,
  recommend_by: String,
  __v: { type: Number,  select: false }
});

WebsiteSchema.methods = {
  create: function() {
    return this.save();
  },
  update: function (obj) {
    Object.assign(this, obj);
    return this.save();
  },
  delete: function () {
    return Website.remove({_id: this._id})
  }
};

WebsiteSchema.statics = {
  getByQuery: function (query, opt, field) {
    opt = opt || {};
    opt.sort = Object.assign({ subcategory: 1, weights: -1 }, opt && opt.sort);
    return this.find(query, field, opt).exec();
  },
  getById: function (id) {
    return this.findById(id).exec();
  }
};
const Website = mongoose.model('Website', WebsiteSchema);

module.exports = Website;
