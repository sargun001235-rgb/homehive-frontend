import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Wishlist from '../models/Wishlist';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const getWishlist = catchAsync(async (req: AuthRequest, res: Response) => {
  let wishlist = await Wishlist.findOne({ user: req.user?._id }).populate({
    path: 'products',
    populate: { path: 'shopId', select: 'name logo city verified' }
  }).lean();
  
  if (!wishlist) {
    const newWishlist = await Wishlist.create({ user: req.user?._id, products: [] });
    wishlist = newWishlist.toObject() as any;
  }
  
  res.json({
    success: true,
    message: 'Wishlist retrieved successfully',
    data: wishlist
  });
});

export const addToWishlist = catchAsync(async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;
  
  let wishlist = await Wishlist.findOne({ user: req.user?._id });
  if (!wishlist) {
    wishlist = new Wishlist({ user: req.user?._id, products: [] });
  }

  if (!wishlist.products.includes(productId as any)) {
    wishlist.products.push(productId as any);
    await wishlist.save();
  }
  
  const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
    path: 'products',
    populate: { path: 'shopId', select: 'name logo city verified' }
  }).lean();
  
  res.json({
    success: true,
    message: 'Added to wishlist',
    data: updatedWishlist
  });
});

export const removeFromWishlist = catchAsync(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  
  const wishlist = await Wishlist.findOne({ user: req.user?._id });
  if (!wishlist) {
    throw new AppError('Wishlist not found', 404, 'WISHLIST_NOT_FOUND');
  }

  wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
  await wishlist.save();
  
  const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
    path: 'products',
    populate: { path: 'shopId', select: 'name logo city verified' }
  }).lean();
  
  res.json({
    success: true,
    message: 'Removed from wishlist',
    data: updatedWishlist
  });
});
