import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Shop } from '../models/Shop';
import { AuthRequest } from '../middleware/authMiddleware';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createProduct = catchAsync(async (req: AuthRequest, res: Response) => {
  const shop = await Shop.findOne({ userId: req.user?._id }).lean();
  if (!shop) {
    throw new AppError('Shop not found. Create a shop first.', 404, 'SHOP_NOT_FOUND');
  }

  const product = await Product.create({
    ...req.body,
    shopId: shop._id,
    sellerId: req.user?._id,
  });

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: product
  });
});

export const updateProduct = catchAsync(async (req: AuthRequest, res: Response) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, sellerId: req.user?._id },
    req.body,
    { new: true, runValidators: true }
  ).lean();

  if (!product) {
    throw new AppError('Product not found or unauthorized', 404, 'PRODUCT_NOT_FOUND');
  }

  res.json({
    success: true,
    message: 'Product updated successfully',
    data: product
  });
});

export const deleteProduct = catchAsync(async (req: AuthRequest, res: Response) => {
  const product = await Product.findOneAndDelete({
    _id: req.params.id,
    sellerId: req.user?._id,
  }).lean();

  if (!product) {
    throw new AppError('Product not found or unauthorized', 404, 'PRODUCT_NOT_FOUND');
  }

  res.json({
    success: true,
    message: 'Product deleted successfully',
    data: null
  });
});

export const getSellerProducts = catchAsync(async (req: AuthRequest, res: Response) => {
  const products = await Product.find({ sellerId: req.user?._id }).sort({ createdAt: -1 }).lean();
  res.json({
    success: true,
    message: 'Seller products retrieved',
    data: products
  });
});

export const getAllProducts = catchAsync(async (req: Request, res: Response) => {
  const { category, search, minPrice, maxPrice, shopId, city, inStock, sortBy, minRating } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  
  let query: any = {};

  if (category) query.category = category;
  if (shopId) query.shopId = shopId;
  if (inStock === 'true') query.stock = { $gt: 0 };
  
  if (city) {
    const shops = await Shop.find({ city: { $regex: new RegExp(`^${city}$`, 'i') } }).lean();
    if (shops.length === 0) {
      res.json({ success: true, message: 'Products retrieved', data: [] });
      return;
    }
    const shopIds = shops.map((s) => s._id);
    query.shopId = { $in: shopIds };
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  if (minRating) {
    query.averageRating = { $gte: Number(minRating) };
  }

  let sortOptions: any = { createdAt: -1 };
  if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
  if (sortBy === 'price-low-high') sortOptions = { price: 1 };
  if (sortBy === 'price-high-low') sortOptions = { price: -1 };
  if (sortBy === 'best-selling' || sortBy === 'trending') sortOptions = { soldCount: -1 };
  if (sortBy === 'top-rated') sortOptions = { averageRating: -1 };

  const products = await Product.find(query)
    .populate('shopId', 'name logo verified city')
    .populate('sellerId', 'name avatar')
    .sort(sortOptions)
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
    
  res.json({
    success: true,
    message: 'Products retrieved',
    data: products
  });
});

export const getProductById = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id)
    .populate('shopId', 'name logo verified city description')
    .populate('sellerId', 'name avatar')
    .lean();
    
  if (!product) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }
  
  res.json({
    success: true,
    message: 'Product retrieved',
    data: product
  });
});
