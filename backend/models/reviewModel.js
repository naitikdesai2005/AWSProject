import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    bakerId: { type: mongoose.Schema.Types.ObjectId, ref: 'baker', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    description: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
}, { minimize: false });

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;