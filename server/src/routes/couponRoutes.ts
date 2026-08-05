import express from 'express';
import { createCoupon, getSellerCoupons, deleteCoupon, validateCoupon } from '../controllers/couponController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/validate', validateCoupon); // public (for customers in checkout)

router.use(protect); // below are seller routes

router.route('/')
  .post(createCoupon)
  .get(getSellerCoupons);

router.route('/:id')
  .delete(deleteCoupon);

export default router;
