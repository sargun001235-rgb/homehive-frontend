import express from 'express';
import { getSellerAnalytics } from '../controllers/analyticsController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/seller')
  .get(protect, authorize('seller'), getSellerAnalytics);

export default router;
