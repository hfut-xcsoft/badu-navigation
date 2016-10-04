const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const SubcategorySchema = new Schema({
  name: String,
  slug: String,
  icon_url: String,
  description: String,
  weights: { type: Number, default: 0 },
  category: ObjectId,
  websites: [{ type: ObjectId, ref: 'Website' }],
  __v: { type: Number,  select: false }
});

SubcategorySchema.methods = {
  create: function() {
    return this.save();
  },
  update: function (obj) {
    Object.assign(this, obj);
    return this.save();
  },
  delete: function () {
    return Subcategory.remove({_id: this._id})
  },
  pushWebsite: function (website) {
    return Subcategory.update({_id: this._id},
      {$push: {websites: website._id}}).exec();
  },
  removeWebsite: function (website) {
    return Subcategory.update({_id: this._id},
      {$pull: {websites: website._id}}).exec()
  }
};

SubcategorySchema.statics = {
  getByQuery: function (query, opt, field) {
    opt = opt || {};
    opt.sort = Object.assign({ weights: -1 }, opt && opt.sort);
    return this.find(query, field, opt).populate('websites').exec();
  },
  getById: function (id) {
    return this.findById(id).populate('websites').exec();
  },
  getBySlug: function (slug) {
    return this.findOne({slug}).populate('websites').exec();
  }
};
const Subcategory = mongoose.model('Subcategory', SubcategorySchema);

module.exports = Subcategory;
