import { Response } from 'express';
import Order from '../models/Order';
import { Product } from '../models/Product';
import catchAsync from '../utils/catchAsync';
import { AuthRequest } from '../middleware/authMiddleware';
import mongoose from 'mongoose';

export const getSellerAnalytics = catchAsync(async (req: AuthRequest, res: Response) => {
  const sellerId = req.user!._id;

  // 1. Revenue & Order Count
  const orderStats = await Order.aggregate([
    { $match: { seller: new mongoose.Types.ObjectId(sellerId as unknown as string), status: { $ne: 'Cancelled' } } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const totalRevenue = orderStats.length > 0 ? orderStats[0].totalRevenue : 0;
  const totalOrders = orderStats.length > 0 ? orderStats[0].totalOrders : 0;

  // 2. Sales Over Time (Monthly)
  const salesGraph = await Order.aggregate([
    { $match: { seller: new mongoose.Types.ObjectId(sellerId as unknown as string), status: { $ne: 'Cancelled' } } },
    {
      $group: {
        _id: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' }
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  // Format the graph data
  const formattedSalesGraph = salesGraph.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    revenue: item.revenue,
    orders: item.orders
  }));

  // 3. Top Products
  const topProducts = await Order.aggregate([
    { $match: { seller: new mongoose.Types.ObjectId(sellerId as unknown as string), status: { $ne: 'Cancelled' } } },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.product',
        soldQuantity: { $sum: '$items.quantity' },
        revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
      }
    },
    { $sort: { soldQuantity: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'productDetails'
      }
    },
    { $unwind: '$productDetails' },
    {
      $project: {
        _id: 1,
        soldQuantity: 1,
        revenue: 1,
        title: '$productDetails.title',
        image: { $arrayElemAt: ['$productDetails.images', 0] }
      }
    }
  ]);

  // 4. Visitors & Conversion Rate (Mocked for now as we don't track raw views yet)
  const visitors = totalOrders * 12; // Mock metric based on orders
  const conversionRate = visitors > 0 ? ((totalOrders / visitors) * 100).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    data: {
      totalRevenue,
      totalOrders,
      visitors,
      conversionRate,
      salesGraph: formattedSalesGraph,
      topProducts
    }
  });
});
