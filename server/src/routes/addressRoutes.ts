import express from 'express';
import { getAddresses, addAddress, deleteAddress } from '../controllers/addressController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', getAddresses);
router.post('/add', addAddress);
router.delete('/:id', deleteAddress);

export default router;
