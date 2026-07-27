import express from 'express';
import { getAddresses, addAddress, deleteAddress } from '../controllers/addressController';
import { protect } from '../middleware/authMiddleware';

import { validateRequest } from '../middleware/validateRequest';
import { addressSchema } from '../utils/validationSchemas';

const router = express.Router();

router.use(protect);

router.get('/', getAddresses);
router.post('/add', validateRequest(addressSchema), addAddress);
router.delete('/:id', deleteAddress);

export default router;
