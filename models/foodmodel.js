const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://naitik05:zUQEbzZTxoIH7X8w@cluster0.sapmd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
const foodSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  breakfast: {
    type: String,
    required: true
  },
  lunch: {
    type: String,
    required: true
  },
  dinner: {
    type: String,
    required: true
  }
}, { timestamps: true });

// Create the food model
const Food = mongoose.model('Food', foodSchema);

// Export the model
module.exports = Food;
