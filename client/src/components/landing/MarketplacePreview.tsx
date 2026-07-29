import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle, Search, MapPin, Store, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '../../store/useProductStore';

const CATEGORIES = ['All', 'Home Bakery', 'Handmade Crafts', 'Jewelry', 'Art & Paintings', 'Cloud Kitchen'];

export default function MarketplacePreview() {
  const navigate = useNavigate();
  const { marketplaceProducts, fetchMarketplaceProducts, isLoading } = useProductStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params: any = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (searchTerm) params.search = searchTerm;
    
    const timer = setTimeout(() => {
      fetchMarketplaceProducts(params);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [activeCategory, searchTerm, fetchMarketplaceProducts]);

  return (
    <section id="marketplace" className="py-16 relative bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-10"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">Discover local brilliance</h2>
            <p className="text-xl text-gray-500">From fresh baked goods to handmade crafts, support the talent in your neighborhood.</p>
          </motion.div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
             <div className="relative w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text"
                  placeholder="Search for cakes, art, crafts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-full focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all shadow-sm font-medium"
                />
             </div>
             <div className="flex flex-wrap gap-2 w-full md:w-auto pb-2">
               {CATEGORIES.map(cat => (
                 <button
                   key={cat}
                   onClick={() => setActiveCategory(cat)}
                   className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                     activeCategory === cat 
                       ? 'bg-foreground text-white shadow-md' 
                       : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                   }`}
                 >
                   {cat}
                 </button>
               ))}
             </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
               <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[380px] animate-pulse">
                 <div className="h-56 bg-gray-200 w-full" />
                 <div className="p-5 flex flex-col flex-1">
                   <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                   <div className="h-4 bg-gray-200 rounded w-1/2 mb-5" />
                   <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-50">
                     <div className="h-8 bg-gray-200 rounded w-20" />
                   </div>
                 </div>
               </div>
            ))
          ) : marketplaceProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: (index % 4) * 0.1, duration: 0.5 }}
              onClick={() => navigate(`/product/${product._id}`)}
              className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col cursor-pointer relative"
            >
              <div className="relative h-56 overflow-hidden bg-gray-100">
                {product.images && product.images[0] ? (
                  <img 
                    src={`${product.images[0]}`} 
                    alt={product.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                    <Store className="w-10 h-10 mb-2 opacity-20" />
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-700 shadow-sm flex items-center">
                  <Tag className="w-3 h-3 mr-1" /> {product.category}
                </div>

                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-foreground text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">Sold Out</span>
                  </div>
                )}
              </div>
              
              <div className="p-5 flex flex-col flex-grow">
                <div className="mb-4">
                  <h3 className="font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">{product.title}</h3>
                </div>
                
                <div className="flex items-center space-x-3 mb-6" onClick={(e) => { e.stopPropagation(); navigate(`/shop/${product.shopId?._id}`); }}>
                  {product.shopId?.logo ? (
                    <img src={`${product.shopId.logo}`} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200">
                      <Store className="w-4 h-4" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-700 hover:text-primary transition-colors flex items-center">
                      {product.shopId?.name || 'Local Seller'}
                      {product.shopId?.verified && <CheckCircle className="w-3 h-3 text-blue-500 ml-1" />}
                    </span>
                    <span className="text-xs font-medium text-gray-500 flex items-center mt-0.5">
                      <MapPin className="w-3 h-3 mr-1" /> {product.shopId?.city || 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                  <span className="font-bold text-2xl text-primary">₹{product.price}</span>
                  <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-md">
                    <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-yellow-700">4.9</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!isLoading && marketplaceProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-16 flex flex-col items-center justify-center text-center bg-white rounded-3xl border border-gray-100 shadow-sm mt-8"
          >
            <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
              <div className="relative bg-white rounded-full p-6 shadow-xl border border-gray-100 flex items-center justify-center z-10">
                <Store className="w-16 h-16 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No products available yet.</h3>
            <p className="text-gray-500 mb-8 text-lg">Be the first seller to publish a product.</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/shop/create')}
              className="px-8 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-xl shadow-primary/30"
            >
              Start Selling Today
            </motion.button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
