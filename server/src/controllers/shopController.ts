import { Request, Response } from 'express';
import { Shop } from '../models/Shop';
import { AuthRequest } from '../middleware/authMiddleware';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createShop = catchAsync(async (req: AuthRequest, res: Response) => {
  const existingShop = await Shop.findOne({ userId: req.user?._id }).lean();
  if (existingShop) {
    throw new AppError('Shop already exists for this user', 400, 'SHOP_EXISTS');
  }

  const shop = await Shop.create({
    ...req.body,
    userId: req.user?._id,
  });

  res.status(201).json({
    success: true,
    message: 'Shop created successfully',
    data: shop
  });
});

export const updateShop = catchAsync(async (req: AuthRequest, res: Response) => {
  const shop = await Shop.findOneAndUpdate(
    { userId: req.user?._id },
    req.body,
    { new: true, runValidators: true }
  ).lean();

  if (!shop) {
    throw new AppError('Shop not found', 404, 'SHOP_NOT_FOUND');
  }

  res.json({
    success: true,
    message: 'Shop updated successfully',
    data: shop
  });
});

export const getMyShop = catchAsync(async (req: AuthRequest, res: Response) => {
  const shop = await Shop.findOne({ userId: req.user?._id }).lean();
  if (!shop) {
    throw new AppError('Shop not found', 404, 'SHOP_NOT_FOUND');
  }
  res.json({
    success: true,
    message: 'Shop retrieved successfully',
    data: shop
  });
});

export const getShopById = catchAsync(async (req: Request, res: Response) => {
  const shop = await Shop.findById(req.params.id).populate('userId', 'name email avatar').lean();
  if (!shop) {
    throw new AppError('Shop not found', 404, 'SHOP_NOT_FOUND');
  }
  res.json({
    success: true,
    message: 'Shop retrieved successfully',
    data: shop
  });
});

export const getAllShops = catchAsync(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  const shops = await Shop.find()
    .populate('userId', 'name avatar')
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
    
  res.json({
    success: true,
    message: 'Shops retrieved successfully',
    data: shops
  });
});
