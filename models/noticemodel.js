const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://naitik05:zUQEbzZTxoIH7X8w@cluster0.sapmd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
