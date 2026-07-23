import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Wishlist from '../models/Wishlist';

export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user?._id }).populate({
      path: 'products',
      populate: { path: 'shopId', select: 'name logo city verified' }
    });
    
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user?._id, products: [] });
    }
    
    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist', error });
  }
};

export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
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
    });
    
    res.json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to wishlist', error });
  }
};

export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    
    const wishlist = await Wishlist.findOne({ user: req.user?._id });
    if (!wishlist) return res.status(404).json({ message: 'Wishlist not found' });

    wishlist.products = wishlist.products.filter(id => id.toString() !== productId);
    await wishlist.save();
    
    const updatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      populate: { path: 'shopId', select: 'name logo city verified' }
    });
    
    res.json(updatedWishlist);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from wishlist', error });
  }
};
