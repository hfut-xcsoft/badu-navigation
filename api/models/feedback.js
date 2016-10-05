const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const FeedbackSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  content: String,
  email: String
});

FeedbackSchema.methods = {
  create: function () {
    return this.save();
  }
};

FeedbackSchema.statics = {
  getFeedbacksByQuery: function (query, opt) {
    opt = opt || {};
    opt.sort = Object.assign({ _id: -1}, opt && opt.sort);
    return this.find(query, {}, opt).exec();
  }
};

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
