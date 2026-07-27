import express from 'express';
import { createReview, getProductReviews, toggleLikeReview, replyToReview } from '../controllers/reviewController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, authorize('customer'), createReview);

router.route('/product/:productId')
  .get(getProductReviews);

router.route('/:id/like')
  .put(protect, authorize('customer', 'seller'), toggleLikeReview);

router.route('/:id/reply')
  .put(protect, authorize('seller'), replyToReview);

export default router;
