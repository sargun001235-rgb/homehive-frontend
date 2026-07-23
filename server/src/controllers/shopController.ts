import { Request, Response } from 'express';
import { Shop } from '../models/Shop';
import { AuthRequest } from '../middleware/authMiddleware';

export const createShop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const existingShop = await Shop.findOne({ userId: req.user?._id });
    if (existingShop) {
      res.status(400).json({ message: 'Shop already exists for this user' });
      return;
    }

    const shop = await Shop.create({
      ...req.body,
      userId: req.user?._id,
    });

    res.status(201).json(shop);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error creating shop' });
  }
};

export const updateShop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const shop = await Shop.findOneAndUpdate(
      { userId: req.user?._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }

    res.json(shop);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error updating shop' });
  }
};

export const getMyShop = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const shop = await Shop.findOne({ userId: req.user?._id });
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }
    res.json(shop);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching shop' });
  }
};

export const getShopById = async (req: Request, res: Response): Promise<void> => {
  try {
    const shop = await Shop.findById(req.params.id).populate('userId', 'name email avatar');
    if (!shop) {
      res.status(404).json({ message: 'Shop not found' });
      return;
    }
    res.json(shop);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching shop' });
  }
};

export const getAllShops = async (req: Request, res: Response): Promise<void> => {
  try {
    const shops = await Shop.find().populate('userId', 'name avatar');
    res.json(shops);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching shops' });
  }
};
