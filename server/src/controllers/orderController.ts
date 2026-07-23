import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import Order from '../models/Order';
import { Product } from '../models/Product';
import Cart from '../models/Cart';

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { shippingAddress, specialInstructions } = req.body;
    
    // Fetch cart
    const cart = await Cart.findOne({ user: req.user?._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Since we assume one seller per order to simplify the seller dashboard, let's just group by the first product's seller for now
    // A robust system would split orders by seller. Here we check that all items belong to the same seller, or just take the first one.
    // For HomeHive phase 4, we'll enforce single-seller cart checkout or split them (we'll just use the first item's seller).
    const sellerId = (cart.items[0].product as any).shopId; 

    let subtotal = 0;
    const orderItems = [];

    // Verify stock and prepare items
    for (const item of cart.items) {
      const product = await Product.findById((item.product as any)._id);
      if (!product) return res.status(404).json({ message: 'Product no longer exists' });
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.title}` });
      }

      subtotal += product.price * item.quantity;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    const shippingCost = 50; // Flat rate for demo
    const totalAmount = subtotal + shippingCost;
    
    const orderNumber = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const order = new Order({
      orderNumber,
      customer: req.user?._id,
      seller: sellerId,
      items: orderItems,
      shippingAddress,
      specialInstructions,
      subtotal,
      shippingCost,
      totalAmount,
      status: 'Pending',
    });

    await order.save();

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error });
  }
};

export const listCustomerOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ customer: req.user?._id })
      .populate('items.product')
      .populate('seller', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const listSellerOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ seller: req.user?._id })
      .populate('items.product')
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
};

export const getOrderDetails = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product')
      .populate('customer', 'name email')
      .populate('seller', 'name email');
      
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Verify access
    if ((order.customer as any)._id.toString() !== req.user?._id?.toString() && (order.seller as any)._id.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order details', error });
  }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Allow customer to cancel if pending
    if (order.customer.toString() === req.user?._id?.toString() && status === 'Cancelled' && order.status === 'Pending') {
      order.status = 'Cancelled';
      await order.save();
      // Restore stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      }
      return res.json(order);
    }
    
    // Seller updates
    if (order.seller.toString() !== req.user?._id?.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this order' });
    }

    order.status = status;
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error });
  }
};
