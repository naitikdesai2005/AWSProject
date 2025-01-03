const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

// const mongoose = require('mongoose');
// const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://naitik05:zUQEbzZTxoIH7X8w@cluster0.sapmd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });
adminSchema.plugin(plm);

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
