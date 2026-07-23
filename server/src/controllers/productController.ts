import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Shop } from '../models/Shop';
import { AuthRequest } from '../middleware/authMiddleware';

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const shop = await Shop.findOne({ userId: req.user?._id });
    if (!shop) {
      res.status(404).json({ message: 'Shop not found. Create a shop first.' });
      return;
    }

    const product = await Product.create({
      ...req.body,
      shopId: shop._id,
      sellerId: req.user?._id,
    });

    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating product' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      res.status(404).json({ message: 'Product not found or unauthorized' });
      return;
    }

    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating product' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      sellerId: req.user?._id,
    });

    if (!product) {
      res.status(404).json({ message: 'Product not found or unauthorized' });
      return;
    }

    res.json({ message: 'Product deleted' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

export const getSellerProducts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ sellerId: req.user?._id }).sort({ createdAt: -1 });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search, minPrice, maxPrice, shopId, city, inStock, sortBy } = req.query;
    let query: any = {};

    if (category) query.category = category;
    if (shopId) query.shopId = shopId;
    if (inStock === 'true') query.stock = { $gt: 0 };
    
    // If filtering by city, first find shops in that city
    if (city) {
      const shops = await Shop.find({ city: { $regex: new RegExp(`^${city}$`, 'i') } });
      if (shops.length === 0) {
        res.json([]);
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

    let sortOptions: any = { createdAt: -1 };
    if (sortBy === 'oldest') sortOptions = { createdAt: 1 };
    if (sortBy === 'price-low-high') sortOptions = { price: 1 };
    if (sortBy === 'price-high-low') sortOptions = { price: -1 };

    const products = await Product.find(query)
      .populate('shopId', 'name logo verified city')
      .populate('sellerId', 'name avatar')
      .sort(sortOptions);
      
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('shopId', 'name logo verified city description')
      .populate('sellerId', 'name avatar');
      
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching product' });
  }
};
