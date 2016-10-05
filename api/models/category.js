const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CategorySchema = new Schema({
  name: String,
  slug: String,
  icon_url: String,
  description: String,
  weights: { type: Number, default: 0 },
  subcategories: [{ type: ObjectId, ref: 'Subcategory' }],
  __v: { type: Number,  select: false }
});

CategorySchema.methods = {
  create: function() {
    return this.save();
  },
  update: function (obj) {
    Object.assign(this, obj);
    return this.save();
  },
  delete: function () {
    return Category.remove({_id: this._id}).exec();
  },
  pushSubcategory: function (subcategory) {
    return Category.update({_id: this._id},
      {$push: {subcategories: subcategory._id}}).exec();
  },
  removeSubcategory: function (subcategory) {
    return Category.update({_id: this._id},
      {$pop: {subcategories: subcategory._id}}).exec()
  }
};

CategorySchema.statics = {
  getByQuery: function (query, opt, field) {
    opt = opt || {};
    opt.sort = Object.assign({ weights: -1 }, opt && opt.sort);
    return this.find(query, field, opt).populate('subcategories').exec();
  },
  getById: function (id) {
    return this.findById(id).populate('subcategories').exec();
  },
  getBySlug: function (slug) {
    return this.findOne({slug}).populate('subcategories').exec();
  },
  getGroupedWebsites: function () {
    return this.find({}, {_id: 0, weights: 0}, { sort: { weights: -1 }})
      .populate({
        path: 'subcategories',
        options: { sort: { weights: -1 } },
        select: { _id: 0, name: 1, slug: 1, icon_url: 1, description: 1, websites: 1 },
        populate: {
          path: 'websites',
          options: { sort: { weights: -1 } },
          select: { _id: 1, name: 1, url: 1, icon_url: 1, description: 1 }
        }
      })
      .lean().exec();
  }
};

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
