const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const WebsiteSchema = new Schema({
  _id: ObjectId,
  date: Date,
  websites: [
    {
      site: { type: ObjectId, ref: 'Website' },
      uv: Number
    }
  ]
});

const Website = mongoose.model('Website', WebsiteSchema);

module.exports = Website;
