import express from 'express';
import { createShop, updateShop, getMyShop, getShopById, getAllShops } from '../controllers/shopController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getAllShops);
router.post('/', protect, createShop);
router.put('/', protect, updateShop);
router.get('/me', protect, getMyShop);
router.get('/:id', getShopById);

export default router;
