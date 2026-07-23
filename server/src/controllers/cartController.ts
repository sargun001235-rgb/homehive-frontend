import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Cart from '../models/Cart';
import { Product } from '../models/Product';

export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user?._id }).populate({
      path: 'items.product',
      populate: { path: 'shopId', select: 'name logo city verified' }
    });
    
    if (!cart) {
      cart = await Cart.create({ user: req.user?._id, items: [] });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Not enough stock available' });

    let cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) {
      cart = new Cart({ user: req.user?._id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    
    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        return res.status(400).json({ message: 'Cannot add more than available stock' });
      }
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId as any, quantity });
    }

    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      populate: { path: 'shopId', select: 'name logo city verified' }
    });
    
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (quantity > product.stock) return res.status(400).json({ message: 'Not enough stock available' });

    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

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
    });
    
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart', error });
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      populate: { path: 'shopId', select: 'name logo city verified' }
    });
    
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error });
  }
};

export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user?._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    cart.items = [];
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};
