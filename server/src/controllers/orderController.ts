import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Order from '../models/Order';
import { Product } from '../models/Product';
import Cart from '../models/Cart';
import { Coupon } from '../models/Coupon';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/AppError';

export const createOrder = catchAsync(async (req: AuthRequest, res: Response) => {
  const { shippingAddress, specialInstructions, couponCode } = req.body;
  
  const cart = await Cart.findOne({ user: req.user?._id }).populate('items.product');
  if (!cart || cart.items.length === 0) {
    throw new AppError('Cart is empty', 400, 'CART_EMPTY');
  }

  const sellerId = (cart.items[0].product as any).shopId; 

  let subtotal = 0;
  const orderItems = [];

  for (const item of cart.items) {
    const product = await Product.findById((item.product as any)._id);
    if (!product) {
      throw new AppError('Product no longer exists', 404, 'PRODUCT_NOT_FOUND');
    }
    if (product.stock < item.quantity) {
      throw new AppError(`Insufficient stock for ${product.title}`, 400, 'INSUFFICIENT_STOCK');
    }

    subtotal += product.price * item.quantity;
    orderItems.push({
      product: product._id,
      quantity: item.quantity,
      price: product.price,
    });

    product.stock -= item.quantity;
    await product.save();
  }

  let discountAmount = 0;
  
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), shopId: sellerId, isActive: true });
    if (coupon) {
      const now = new Date();
      if (now >= new Date(coupon.startDate) && now <= new Date(coupon.endDate)) {
        if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
          if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
            if (coupon.discountType === 'fixed') {
              discountAmount = coupon.discountValue;
            } else {
              discountAmount = (subtotal * coupon.discountValue) / 100;
              if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
              }
            }
            if (discountAmount > subtotal) discountAmount = subtotal;
            
            // Increment usage count
            coupon.usedCount += 1;
            await coupon.save();
          }
        }
      }
    }
  }

  const shippingCost = 50;
  const totalAmount = subtotal + shippingCost - discountAmount;
  
  const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

  const order = new Order({
    orderNumber,
    customer: req.user?._id,
    seller: sellerId,
    items: orderItems,
    shippingAddress,
    specialInstructions,
    subtotal,
    shippingCost,
    discountAmount,
    couponCode: discountAmount > 0 ? couponCode.toUpperCase() : undefined,
    totalAmount,
    status: 'Pending',
    timeline: [
      {
        status: 'Pending',
        date: new Date(),
        description: 'Order placed successfully and is pending confirmation.',
      }
    ]
  });

  await order.save();

  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    data: order
  });
});

export const listCustomerOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ customer: req.user?._id })
    .populate('items.product')
    .populate('seller', 'name email')
    .sort({ createdAt: -1 })
    .lean();
    
  res.json({
    success: true,
    message: 'Orders retrieved successfully',
    data: orders
  });
});

export const listSellerOrders = catchAsync(async (req: AuthRequest, res: Response) => {
  const orders = await Order.find({ seller: req.user?._id })
    .populate('items.product')
    .populate('customer', 'name email')
    .sort({ createdAt: -1 })
    .lean();
    
  res.json({
    success: true,
    message: 'Orders retrieved successfully',
    data: orders
  });
});

export const getOrderDetails = catchAsync(async (req: AuthRequest, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('items.product')
    .populate('customer', 'name email')
    .populate('seller', 'name email')
    .lean();
    
  if (!order) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }
  
  if ((order.customer as any)._id.toString() !== req.user?._id?.toString() && (order.seller as any)._id.toString() !== req.user?._id?.toString()) {
    throw new AppError('Not authorized', 403, 'FORBIDDEN');
  }

  res.json({
    success: true,
    message: 'Order details retrieved',
    data: order
  });
});

export const updateOrderStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const { status, description, location } = req.body;
  const order = await Order.findById(req.params.id);
  
  if (!order) {
    throw new AppError('Order not found', 404, 'ORDER_NOT_FOUND');
  }
  
  if (order.customer.toString() === req.user?._id?.toString() && status === 'Cancelled' && order.status === 'Pending') {
    order.status = 'Cancelled';
    order.timeline.push({
      status: 'Cancelled',
      date: new Date(),
      description: description || 'Order cancelled by customer.',
    });
    await order.save();
    
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
    }
    
    return res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  }
  
  if (order.seller.toString() !== req.user?._id?.toString()) {
    throw new AppError('Not authorized to update this order', 403, 'FORBIDDEN');
  }

  order.status = status;
  order.timeline.push({
    status,
    date: new Date(),
    description: description || `Order status updated to ${status}.`,
    location: location || undefined
  });

  await order.save();
  
  res.json({
    success: true,
    message: 'Order status updated',
    data: order
  });
});
