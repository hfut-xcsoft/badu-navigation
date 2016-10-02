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
    return Statistic.find({ date: todayDate, 'websites.website': websiteId })
      .count().exec().then(count => {
        console.log(count);
        if (!count) {
          return Statistic.update(
            { date: todayDate },
            { $push: {
              websites: {
                website: websiteId,
                count: 1
              }
            }},
            { upsert: true, new: true }).exec()
        } else {
          return Statistic.update(
            { date: todayDate, 'websites.website': websiteId },
            { $inc: { 'websites.$.count': 1 }},
            { upsert: 1 }).exec();
        }
    });
  },
  getHotWebsitesInCategory: function (categorySet, day) {
    return this.aggregate([
      { $match: { date : { $gte: new Date(getTodayDate() - 86400e3 * (day - 1)) }}},
      { $unwind: "$websites" },
      { $match: { "websites.website": { $in: categorySet }}},
      { $project: { _id: "$websites.website", count: "$websites.count" }},
      { $group: { _id: "$_id", count: { $sum: "$count" }}},
      { $sort: { count: -1 }},
      { $limit: 20 },
      { $lookup: { localField: "_id", from: "websites", foreignField: "_id", as: "website" }},
      { $unwind: "$website" },
      { $project: { _id: "$website._id", name: "$website.name", url: "$website.url", description: "$website.description" }}
    ]).exec();
  }
}

const Statistic = mongoose.model('Statistic', StatisticSchema);

module.exports = Statistic;
