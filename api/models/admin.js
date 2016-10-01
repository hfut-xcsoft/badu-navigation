const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;
const utils = require('../commons/utils');

const AdminSchema = new Schema({
  username: String,
  password: String
});

AdminSchema.pre('save', function () {
  this.password = utils.md5(this.password);
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;