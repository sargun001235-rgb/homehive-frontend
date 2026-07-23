import { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (orderId) {
      const end = Date.now() + 3 * 1000;
      const colors = ['#f59e0b', '#10b981', '#3b82f6'];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [orderId]);

  if (!orderId) {
    return <Navigate to="/dashboard/customer" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-xl border border-gray-100 text-center"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500"
        >
          <CheckCircle className="w-12 h-12" />
        </motion.div>
        
        <h1 className="text-3xl font-bold text-foreground mb-4">Order Confirmed!</h1>
        <p className="text-gray-500 mb-8 text-lg">
          Thank you for your purchase. Your order <span className="font-bold text-foreground">{orderId}</span> has been received and is being processed.
        </p>
        
        <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left border border-gray-100">
          <div className="flex items-center text-gray-700 font-bold mb-2">
            <Package className="w-5 h-5 mr-2 text-primary" /> Estimated Delivery
          </div>
          <p className="text-gray-500 text-sm ml-7">Within 3-5 business days</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/dashboard/customer')} // We will route to orders tab eventually
            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 flex items-center justify-center"
          >
            View Orders <ArrowRight className="w-5 h-5 ml-2" />
          </button>
          
          <button 
            onClick={() => navigate('/dashboard/customer')}
            className="w-full py-4 bg-gray-50 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" /> Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
