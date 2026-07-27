import { Request, Response } from 'express';
import Review from '../models/Review';
import Order from '../models/Order';
import AppError from '../utils/AppError';
import catchAsync from '../utils/catchAsync';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

// Create a Review
export const createReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const { product, rating, comment, photos } = req.body;
  const user = req.user!._id;

  // Check if review already exists
  const existingReview = await Review.findOne({ product, user });
  if (existingReview) {
    throw new AppError('You have already reviewed this product', 400);
  }

  // Check if verified purchase
  const hasPurchased = await Order.findOne({
    customer: user,
    'items.product': product,
    status: { $in: ['Delivered'] }
  });

  const review = await Review.create({
    product,
    user,
    rating,
    comment,
    photos: photos || [],
    verifiedPurchase: !!hasPurchased
  });

  res.status(201).json({
    success: true,
    data: review
  });
});

// Get Reviews for a Product
export const getProductReviews = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  // Sorting
  const sortOption: any = {};
  if (req.query.sort === 'newest') sortOption.createdAt = -1;
  else if (req.query.sort === 'highest') sortOption.rating = -1;
  else if (req.query.sort === 'lowest') sortOption.rating = 1;
  else sortOption.createdAt = -1;

  // Filtering
  const matchOption: any = { product: new mongoose.Types.ObjectId(productId as string) };
  if (req.query.rating) matchOption.rating = parseInt(req.query.rating as string);
  if (req.query.withPhotos === 'true') matchOption.photos = { $exists: true, $not: { $size: 0 } };

  const reviews = await Review.find(matchOption)
    .sort(sortOption)
    .skip(skip)
    .limit(limit)
    .populate('user', 'name avatar')
    .lean();

  const total = await Review.countDocuments(matchOption);
  
  // Also get aggregate rating data for the product
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId as string) } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        fiveStar: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        fourStar: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        threeStar: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        twoStar: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
      }
    }
  ]);

  res.status(200).json({
    success: true,
    count: reviews.length,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    data: reviews,
    stats: stats.length > 0 ? stats[0] : null
  });
});

// Like a Review
export const toggleLikeReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new AppError('Review not found', 404);

  const userId = req.user!._id;
  const index = review.likes.indexOf(userId as any);

  if (index === -1) {
    review.likes.push(userId as any);
  } else {
    review.likes.splice(index, 1);
  }

  await review.save();

  res.status(200).json({ success: true, data: review });
});

// Seller Reply
export const replyToReview = catchAsync(async (req: AuthRequest, res: Response) => {
  const { sellerResponse } = req.body;
  const review = await Review.findById(req.params.id).populate('product');
  if (!review) throw new AppError('Review not found', 404);

  review.sellerResponse = sellerResponse;
  await review.save();

  res.status(200).json({ success: true, data: review });
});
