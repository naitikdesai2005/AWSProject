import express from 'express';
import { createReview, getUserReviews, getBakerReviews, updateReview, deleteReview } from '../controllers/reviewController.js';
import authMiddleware from '../middleware/auth.js';

const reviewRouter = express.Router();

reviewRouter.post('/create', authMiddleware, createReview);
reviewRouter.get('/user', authMiddleware, getUserReviews);
reviewRouter.get('/baker', authMiddleware, getBakerReviews);
reviewRouter.put('/update', authMiddleware, updateReview);
reviewRouter.delete('/delete/:reviewId', authMiddleware, deleteReview);

export default reviewRouter;