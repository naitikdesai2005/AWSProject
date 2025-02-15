import reviewModel from '../models/reviewModel.js';
import userModel from '../models/userModel.js';
import bakerModel from '../models/bakerModel.js';

export const createReview = async (req, res) => {
    try {
        const { bakerId, rating, description } = req.body;
        const userId = req.body.userId;

        const newReview = new reviewModel({
            userId,
            bakerId,
            rating,
            description
        });

        await newReview.save();
        res.status(201).json({ success: true, message: 'Review created successfully', review: newReview });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error creating review' });
    }
};

export const getUserReviews = async (req, res) => {
    try {
        const userId = req.body.userId;
        const reviews = await reviewModel.find({ userId }).populate('bakerId', 'bakeryname');
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching user reviews' });
    }
};

export const getBakerReviews = async (req, res) => {
    try {
        const bakerId = req.body.userId;
        const reviews = await reviewModel.find({ bakerId }).populate('userId', 'name');
        res.status(200).json({ success: true, reviews });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching baker reviews' });
    }
};

export const updateReview = async (req, res) => {
    try {
        const { reviewId, rating, description } = req.body;
        const userId = req.user._id;

        const review = await reviewModel.findOneAndUpdate(
            { _id: reviewId, userId },
            { rating, description },
            { new: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found or not authorized' });
        }

        res.status(200).json({ success: true, message: 'Review updated successfully', review });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating review' });
    }
};

export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const userId = req.user._id;

        const review = await reviewModel.findOneAndDelete({ _id: reviewId, userId });

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found or not authorized' });
        }

        res.status(200).json({ success: true, message: 'Review deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error deleting review' });
    }
};