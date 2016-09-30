const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const VisitDaySchema = new Schema({
  date: Date,
  websites: [
    {
      site: { type: ObjectId, ref: 'Website' },
      uv: Number
    }
  ]
});

const VisitDay = mongoose.model('VisitDay', VisitDaySchema);

module.exports = VisitDay;
