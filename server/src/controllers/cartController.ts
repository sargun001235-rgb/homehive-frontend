import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Cart from '../models/Cart';
import { Product } from '../models/Product';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const getCart = catchAsync(async (req: AuthRequest, res: Response) => {
  let cart = await Cart.findOne({ user: req.user?._id }).populate({
    path: 'items.product',
    populate: { path: 'shopId', select: 'name logo city verified' }
  }).lean();
  
  if (!cart) {
    const newCart = await Cart.create({ user: req.user?._id, items: [] });
    cart = newCart.toObject() as any;
  }
  
  res.json({
    success: true,
    message: 'Cart retrieved successfully',
    data: cart
  });
});

export const addToCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  
  const product = await Product.findById(productId).lean();
  if (!product) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }
  if (product.stock < quantity) {
    throw new AppError('Not enough stock available', 400, 'INSUFFICIENT_STOCK');
  }

  let cart = await Cart.findOne({ user: req.user?._id });
  if (!cart) {
    cart = new Cart({ user: req.user?._id, items: [] });
  }

  const existingItem = cart.items.find(item => item.product.toString() === productId);
  
  if (existingItem) {
    if (existingItem.quantity + quantity > product.stock) {
      throw new AppError('Cannot add more than available stock', 400, 'EXCEEDS_STOCK');
    }
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId as any, quantity });
  }

  await cart.save();
  
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    populate: { path: 'shopId', select: 'name logo city verified' }
  }).lean();
  
  res.json({
    success: true,
    message: 'Item added to cart',
    data: updatedCart
  });
});

export const updateCartItem = catchAsync(async (req: AuthRequest, res: Response) => {
  const { productId, quantity } = req.body;
  
  const product = await Product.findById(productId).lean();
  if (!product) {
    throw new AppError('Product not found', 404, 'PRODUCT_NOT_FOUND');
  }
  if (quantity > product.stock) {
    throw new AppError('Not enough stock available', 400, 'INSUFFICIENT_STOCK');
  }

  const cart = await Cart.findOne({ user: req.user?._id });
  if (!cart) {
    throw new AppError('Cart not found', 404, 'CART_NOT_FOUND');
  }

  const item = cart.items.find(item => item.product.toString() === productId);
  if (item) {
    if (quantity === 0) {
      cart.items = cart.items.filter(item => item.product.toString() !== productId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
  }
  
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    populate: { path: 'shopId', select: 'name logo city verified' }
  }).lean();
  
  res.json({
    success: true,
    message: 'Cart item updated',
    data: updatedCart
  });
});

export const removeFromCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const { productId } = req.params;
  
  const cart = await Cart.findOne({ user: req.user?._id });
  if (!cart) {
    throw new AppError('Cart not found', 404, 'CART_NOT_FOUND');
  }

  cart.items = cart.items.filter(item => item.product.toString() !== productId);
  await cart.save();
  
  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.product',
    populate: { path: 'shopId', select: 'name logo city verified' }
  }).lean();
  
  res.json({
    success: true,
    message: 'Item removed from cart',
    data: updatedCart
  });
});

export const clearCart = catchAsync(async (req: AuthRequest, res: Response) => {
  const cart = await Cart.findOne({ user: req.user?._id });
  if (!cart) {
    throw new AppError('Cart not found', 404, 'CART_NOT_FOUND');
  }

  cart.items = [];
  await cart.save();
  
  res.json({
    success: true,
    message: 'Cart cleared',
    data: { _id: cart._id, user: cart.user, items: [] }
  });
});
