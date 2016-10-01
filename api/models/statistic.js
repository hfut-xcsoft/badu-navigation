const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const StatisticSchema = new Schema({
  date: Date,
  websites: [{
    website: ObjectId,
    count: Number
  }]
});

function getTodayDate() {
  return new Date().setHours(8, 0, 0, 0);
}

StatisticSchema.statics = {
  addClickCount: function (websiteId) {
    const todayDate = getTodayDate();
    return Statistic.find({date: todayDate, 'websites.website': websiteId})
      .count().exec().then(count => {
        console.log(count);
        if (!count) {
          return Statistic.update(
            {date: todayDate},
            {$push: {
              websites: {
                website: websiteId,
                count: 1
              }
            }},
            //{date: new Date("Sat, 01 Oct 2016 00:00:00 GMT") },
            //{$push: {
            //  websites: {
            //    website: "57efa76184ce6d22fe5b4454",
            //    count: 1
            //  }
            //}},
            {upsert: true, new: true}).exec()
        } else {
          return Statistic.update(
            {date: todayDate, 'websites.website': websiteId},
            {$inc: {'websites.$.count': 1}},
            {upsert: 1}).exec();
        }
    });
  }
}

const Statistic = mongoose.model('Statistic', StatisticSchema);

module.exports = Statistic;
