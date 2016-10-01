const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const FeedbackSchema = new Schema({
  created_at: { type: Date, default: Date.now },
  content: String
});

FeedbackSchema.methods = {
  create: function () {
    return this.save();
  }
};

FeedbackSchema.statics = {
  getFeedbacksByQuery: function (query, opt) {
    return this.find(query, {}, opt).exec();
  }
};

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
