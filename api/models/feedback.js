const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const FeedbackSchema = new Schema({
  _id: ObjectId,
  created_at: Date,
  content: String
});

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
