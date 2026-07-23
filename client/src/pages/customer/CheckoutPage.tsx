import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle, Truck, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useAddressStore } from '../../store/useAddressStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, fetchCart } = useCartStore();
  const { createOrder, isLoading: isOrdering } = useOrderStore();
  const { addresses, fetchAddresses } = useAddressStore();
  
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    phoneNumber: '',
    addressLine: '',
    city: '',
    state: '',
    postalCode: ''
  });
  const [specialInstructions, setSpecialInstructions] = useState('');

  useEffect(() => {
    fetchCart();
    fetchAddresses();
  }, [fetchCart, fetchAddresses]);

  useEffect(() => {
    if (addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setShippingAddress({
        fullName: defaultAddr.fullName,
        phoneNumber: defaultAddr.phoneNumber,
        addressLine: defaultAddr.addressLine,
        city: defaultAddr.city,
        state: defaultAddr.state,
        postalCode: defaultAddr.postalCode
      });
    }
  }, [addresses]);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/dashboard/customer')} className="px-6 py-2 bg-primary text-white rounded-full">Return to Shop</button>
      </div>
    );
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    try {
      const order = await createOrder(shippingAddress, specialInstructions);
      navigate('/order-success', { state: { orderId: order.orderNumber } });
    } catch (error) {
      // Error handled in store
    }
  };

  const shippingCost = 50;
  const total = cartTotal() + shippingCost;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => step === 1 ? navigate('/cart') : setStep(1)} 
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> {step === 1 ? 'Back to Cart' : 'Back to Shipping'}
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100">
              
              {/* Stepper */}
              <div className="flex items-center mb-10">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>1</div>
                <div className={`flex-1 h-1 mx-2 rounded ${step >= 2 ? 'bg-primary' : 'bg-gray-100'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'}`}>2</div>
                <div className="flex-1 h-1 mx-2 rounded bg-gray-100"></div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm bg-gray-100 text-gray-400"><CheckCircle className="w-4 h-4" /></div>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.form 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onSubmit={handleNext}
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <Truck className="w-6 h-6 mr-2 text-primary" /> Shipping Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name *</label>
                        <input required type="text" value={shippingAddress.fullName} onChange={e => setShippingAddress({...shippingAddress, fullName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number *</label>
                        <input required type="tel" value={shippingAddress.phoneNumber} onChange={e => setShippingAddress({...shippingAddress, phoneNumber: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="+91 98765 43210" />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Address Line *</label>
                      <input required type="text" value={shippingAddress.addressLine} onChange={e => setShippingAddress({...shippingAddress, addressLine: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Apartment, suite, unit, building, floor, etc." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">City *</label>
                        <input required type="text" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">State *</label>
                        <input required type="text" value={shippingAddress.state} onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Postal Code *</label>
                        <input required type="text" value={shippingAddress.postalCode} onChange={e => setShippingAddress({...shippingAddress, postalCode: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                    </div>

                    <div className="mb-8">
                      <label className="block text-sm font-bold text-gray-700 mb-2">Special Instructions (Optional)</label>
                      <textarea value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)} rows={3} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder="Leave at the front door, call before delivery, etc." />
                    </div>

                    <button type="submit" className="w-full py-4 bg-foreground text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg flex items-center justify-center group">
                      Continue to Payment
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </motion.form>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
                      <ShieldCheck className="w-6 h-6 mr-2 text-primary" /> Payment Method
                    </h2>
                    
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 text-blue-800 text-sm font-medium leading-relaxed">
                      For Phase 4 demonstration purposes, online payment gateways have been disabled. 
                      Orders placed will be marked as "Pending" and confirmed manually by the seller.
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 mb-8 cursor-pointer ring-2 ring-primary">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground">Cash on Delivery / Direct Transfer</span>
                        <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <p className="text-gray-500 text-sm mt-2">Pay when the order arrives or coordinate directly with the seller.</p>
                    </div>

                    <button 
                      onClick={handlePlaceOrder}
                      disabled={isOrdering}
                      className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/30 flex items-center justify-center disabled:opacity-50"
                    >
                      {isOrdering ? 'Placing Order...' : `Place Order (₹${total})`}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center"><ShoppingBag className="w-5 h-5 mr-2 text-primary" /> Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {cartItems.map(item => (
                  <div key={item.product._id} className="flex justify-between items-start text-sm">
                    <div className="flex gap-3 w-3/4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.product.images?.[0] && <img src={`http://localhost:5000${item.product.images[0]}`} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-bold text-foreground line-clamp-1">{item.product.title}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-foreground w-1/4 text-right">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-3 mb-6 text-sm font-medium border-t border-gray-100 pt-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="text-foreground">₹{cartTotal()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-foreground">₹{shippingCost}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-foreground">Total</span>
                  <span className="text-3xl font-bold text-primary">₹{total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
