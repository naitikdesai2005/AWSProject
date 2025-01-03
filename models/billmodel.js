const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  roomNo: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    enum: ['fee', 'bill'],
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending'],
    default: 'pending'
  }
}, { timestamps: true });

const Bill = mongoose.model('Bill', billSchema);

// Export the model
module.exports = Bill;
