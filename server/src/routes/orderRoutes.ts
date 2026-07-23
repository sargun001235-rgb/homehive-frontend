import express from 'express';
import { createOrder, listCustomerOrders, listSellerOrders, getOrderDetails, updateOrderStatus } from '../controllers/orderController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.post('/create', createOrder);
router.get('/customer', listCustomerOrders);
router.get('/seller', listSellerOrders);
router.get('/details/:id', getOrderDetails);
router.put('/update-status/:id', updateOrderStatus);

export default router;
