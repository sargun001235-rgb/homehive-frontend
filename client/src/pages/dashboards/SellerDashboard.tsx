import { Package, TrendingUp, AlertCircle, Plus, ArrowRight } from 'lucide-react';
import { useShopStore } from '../../store/useShopStore';
import { useProductStore } from '../../store/useProductStore';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SellerDashboard() {
  const { myShop } = useShopStore();
  const { sellerProducts } = useProductStore();

  if (!myShop) return null;

  const totalProducts = sellerProducts.length;
  const outOfStock = sellerProducts.filter(p => p.stock === 0).length;
  const inStock = totalProducts - outOfStock;

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent z-0"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back to {myShop.name}!</h2>
            <p className="text-foreground/60 max-w-lg">
              Your shop profile is looking great. You have {totalProducts} products live on the marketplace. Keep adding products to attract more local customers.
            </p>
          </div>
          <div className="relative z-10 mt-6 md:mt-0">
            <Link to="/dashboard/seller/products?new=true" className="bg-foreground text-white px-6 py-3 rounded-full font-semibold flex items-center hover:bg-primary transition-all transform hover:scale-105 shadow-lg">
              <Plus className="w-5 h-5 mr-2" /> Add Product
            </Link>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-foreground/60 mb-1">Total Products</p>
                <h3 className="text-4xl font-bold text-foreground">{totalProducts}</h3>
              </div>
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-foreground/60 mb-1">In Stock</p>
                <h3 className="text-4xl font-bold text-green-500">{inStock}</h3>
              </div>
              <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-foreground/60 mb-1">Out of Stock</p>
                <h3 className={`text-4xl font-bold ${outOfStock > 0 ? 'text-red-500' : 'text-foreground'}`}>{outOfStock}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${outOfStock > 0 ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
                <AlertCircle className="w-6 h-6" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Products */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">Recent Products</h3>
            <Link to="/dashboard/seller/products" className="text-sm font-semibold text-primary hover:underline flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-0">
            {sellerProducts.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-foreground/60 font-medium">No products added yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {sellerProducts.slice(0, 5).map((product) => (
                  <div key={product._id} className="p-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                        {product.images?.[0] ? (
                          <img src={`http://localhost:5000${product.images[0]}`} alt={product.title} className="w-full h-full object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400 m-auto mt-3" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{product.title}</p>
                        <p className="text-xs text-foreground/50">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">₹{product.price}</p>
                      <p className={`text-xs font-semibold ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
