import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Minus, Plus, Trash2, ArrowLeft, ArrowRight, Store } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { motion } from 'framer-motion';

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, isLoading, fetchCart, updateQuantity, removeFromCart, cartTotal } = useCartStore();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-24 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto bg-white p-12 rounded-[2rem] shadow-xl border border-gray-100"
          >
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added any items to your cart yet.</p>
            <button 
              onClick={() => navigate('/dashboard/customer')} 
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
            >
              Start Shopping
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Continue Shopping
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="hidden sm:flex border-b border-gray-100 pb-4 mb-6 text-sm font-bold text-gray-400 uppercase tracking-wider">
                <div className="w-3/5">Product</div>
                <div className="w-1/5 text-center">Quantity</div>
                <div className="w-1/5 text-right">Total</div>
              </div>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={item.product._id} 
                    className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b border-gray-50 last:border-0 last:pb-0"
                  >
                    <div className="flex w-full sm:w-3/5 items-center mb-4 sm:mb-0">
                      <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.product._id}`)}>
                        {item.product.images?.[0] ? (
                          <img src={`${item.product.images[0]}`} className="w-full h-full object-cover" alt={item.product.title} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Store className="w-8 h-8 text-gray-300" /></div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <Link to={`/product/${item.product._id}`} className="font-bold text-lg text-foreground hover:text-primary transition-colors line-clamp-1">{item.product.title}</Link>
                        <Link to={`/shop/${item.product.shopId?._id}`} className="text-sm font-medium text-gray-500 hover:text-primary transition-colors mt-1 block">By {item.product.shopId?.name || 'Seller'}</Link>
                        <div className="text-primary font-bold mt-2 sm:hidden">₹{item.product.price}</div>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/5 flex justify-between sm:justify-center items-center">
                      <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1">
                        <button 
                          onClick={() => updateQuantity(item.product._id, Math.max(1, item.quantity - 1))}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-50"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          disabled={item.quantity >= item.product.stock}
                          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-50"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="sm:hidden w-10 h-10 flex items-center justify-center text-red-500 bg-red-50 rounded-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="hidden sm:flex w-1/5 justify-end items-center">
                      <span className="font-bold text-lg">₹{item.product.price * item.quantity}</span>
                      <button 
                        onClick={() => removeFromCart(item.product._id)}
                        className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[380px]">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-sm font-medium">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="text-foreground">₹{cartTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span className="text-foreground">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Estimated Total</span>
                  <span className="text-2xl font-bold text-primary">₹{cartTotal()}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-foreground text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center group"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
