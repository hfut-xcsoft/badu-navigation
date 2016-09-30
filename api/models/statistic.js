const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const StatisticSchema = new Schema({
  date: Date,
  websites: [
    {
      website: { type: ObjectId, ref: 'Website' },
      uv: Number
    }
  ]
});

const Statistic = mongoose.model('Statistic', StatisticSchema);

module.exports = Statistic;
