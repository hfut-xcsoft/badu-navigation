const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
const utils = require('../commons/utils');

const AdminSchema = new Schema({
  _id: ObjectId,
  username: String,
  password: String
});

AdminSchema.pre('save', function () {
  this.password = utils.md5(this.password);
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;