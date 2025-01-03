const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://naitik05:zUQEbzZTxoIH7X8w@cluster0.sapmd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
const studentSchema = new mongoose.Schema({
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
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  roomNo: {
    type: String,
    required: true
  },
  collegeID: {
    type: String,
    required: true
  },
  collegeCourse: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  guardianName: {
    type: String,
    required: true
  },
  guardianPhone: {
    type: String,
    required: true
  },
  guardianEmail: {
    type: String,
    required: true
  },
  leaveRequests: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LeaveRequest'
  }],
  complaints: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Complaint'
  }]
}, { timestamps: true });

studentSchema.plugin(plm);

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
