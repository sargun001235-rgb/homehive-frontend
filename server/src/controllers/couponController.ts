import { Request, Response } from 'express';
import { Coupon } from '../models/Coupon';
import { Shop } from '../models/Shop';
import { AuthRequest } from '../middleware/authMiddleware';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createCoupon = catchAsync(async (req: AuthRequest, res: Response) => {
  const shop = await Shop.findOne({ userId: req.user?._id });
  if (!shop) {
    throw new AppError('Shop not found', 404, 'SHOP_NOT_FOUND');
  }

  const { code, discountType, discountValue, minOrderValue, maxDiscount, startDate, endDate, usageLimit } = req.body;

  const existingCoupon = await Coupon.findOne({ code: code.toUpperCase(), shopId: shop._id });
  if (existingCoupon) {
    throw new AppError('Coupon code already exists for this shop', 400, 'COUPON_EXISTS');
  }

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    shopId: shop._id,
    discountType,
    discountValue,
    minOrderValue,
    maxDiscount,
    startDate,
    endDate,
    usageLimit,
  });

  res.status(201).json({
    success: true,
    message: 'Coupon created successfully',
    data: coupon
  });
});

export const getSellerCoupons = catchAsync(async (req: AuthRequest, res: Response) => {
  const shop = await Shop.findOne({ userId: req.user?._id });
  if (!shop) {
    throw new AppError('Shop not found', 404, 'SHOP_NOT_FOUND');
  }

  const coupons = await Coupon.find({ shopId: shop._id }).sort({ createdAt: -1 }).lean();

  res.json({
    success: true,
    data: coupons
  });
});

export const deleteCoupon = catchAsync(async (req: AuthRequest, res: Response) => {
  const shop = await Shop.findOne({ userId: req.user?._id });
  if (!shop) {
    throw new AppError('Shop not found', 404, 'SHOP_NOT_FOUND');
  }

  const coupon = await Coupon.findOneAndDelete({ _id: req.params.id, shopId: shop._id });
  
  if (!coupon) {
    throw new AppError('Coupon not found', 404, 'COUPON_NOT_FOUND');
  }

  res.json({
    success: true,
    message: 'Coupon deleted successfully'
  });
});

export const validateCoupon = catchAsync(async (req: Request, res: Response) => {
  const { code, shopId, orderValue } = req.body;

  if (!code || !shopId || !orderValue) {
    throw new AppError('Please provide code, shopId, and orderValue', 400, 'INVALID_INPUT');
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), shopId, isActive: true });

  if (!coupon) {
    throw new AppError('Invalid or inactive coupon code', 400, 'INVALID_COUPON');
  }

  const now = new Date();
  if (now < new Date(coupon.startDate) || now > new Date(coupon.endDate)) {
    throw new AppError('Coupon is expired or not yet active', 400, 'EXPIRED_COUPON');
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new AppError('Coupon usage limit reached', 400, 'COUPON_LIMIT_REACHED');
  }

  if (coupon.minOrderValue && orderValue < coupon.minOrderValue) {
    throw new AppError(`Minimum order value to use this coupon is ₹${coupon.minOrderValue}`, 400, 'MIN_ORDER_VALUE_NOT_MET');
  }

  let discountAmount = 0;
  if (coupon.discountType === 'fixed') {
    discountAmount = coupon.discountValue;
  } else if (coupon.discountType === 'percentage') {
    discountAmount = (orderValue * coupon.discountValue) / 100;
    if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
      discountAmount = coupon.maxDiscount;
    }
  }

  // Cap discount to order value
  if (discountAmount > orderValue) {
    discountAmount = orderValue;
  }

  res.json({
    success: true,
    message: 'Coupon applied successfully',
    data: {
      couponId: coupon._id,
      code: coupon.code,
      discountAmount,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue
    }
  });
});
