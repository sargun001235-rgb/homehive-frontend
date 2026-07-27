import express from 'express';
import { createShop, updateShop, getMyShop, getShopById, getAllShops } from '../controllers/shopController';
import { protect } from '../middleware/authMiddleware';

import { validateRequest } from '../middleware/validateRequest';
import { createShopSchema } from '../utils/validationSchemas';

const router = express.Router();

router.get('/', getAllShops);
router.post('/', protect, validateRequest(createShopSchema), createShop);
router.put('/', protect, validateRequest(createShopSchema), updateShop);
router.get('/me', protect, getMyShop);
router.get('/:id', getShopById);

export default router;
