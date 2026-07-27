import express from 'express';
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  getSellerProducts, 
  getAllProducts, 
  getProductById 
} from '../controllers/productController';
import { protect } from '../middleware/authMiddleware';

import { validateRequest } from '../middleware/validateRequest';
import { productSchema } from '../utils/validationSchemas';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/seller', protect, getSellerProducts);
router.get('/:id', getProductById);

router.post('/', protect, validateRequest(productSchema), createProduct);
router.put('/:id', protect, validateRequest(productSchema), updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
