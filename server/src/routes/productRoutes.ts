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

const router = express.Router();

router.get('/', getAllProducts);
router.get('/seller', protect, getSellerProducts);
router.get('/:id', getProductById);

router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.delete('/:id', protect, deleteProduct);

export default router;
