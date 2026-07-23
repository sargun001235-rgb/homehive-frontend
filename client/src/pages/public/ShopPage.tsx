import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, CheckCircle, Clock, Phone, Instagram, Facebook, Share2, Grid, Package, Search, ChevronDown, ArrowLeft, Star, Store } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' }
];

export default function ShopPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shop, setShop] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchShopAndProducts = async () => {
      window.scrollTo(0, 0);
      try {
        const [shopRes, productsRes] = await Promise.all([
          api.get(`/shop/${id}`),
          api.get(`/product?shopId=${id}`)
        ]);
        setShop(shopRes.data);
        setAllProducts(productsRes.data);
        setDisplayedProducts(productsRes.data);
      } catch (error) {
        toast.error('Failed to load shop details');
      } finally {
        setLoading(false);
      }
    };
    fetchShopAndProducts();
  }, [id]);

  useEffect(() => {
    let filtered = [...allProducts];
    if (searchTerm) {
      filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    
    if (sortBy === 'price-low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high-low') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      // newest
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    
    setDisplayedProducts(filtered);
  }, [searchTerm, sortBy, allProducts]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Shop link copied to clipboard!');
  };

  const renderSkeleton = () => (
    Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[300px] animate-pulse">
        <div className="h-48 bg-gray-200 w-full" />
        <div className="p-4 flex flex-col flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50">
            <div className="h-5 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    ))
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
  
  if (!shop) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Store className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-foreground">Shop not found</h2>
      <button onClick={() => navigate(-1)} className="mt-6 px-6 py-2 bg-primary text-white rounded-full font-bold">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      
      {/* Top Header */}
      <div className="absolute top-0 w-full z-20 p-4">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-white hover:text-primary transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Banner */}
      <div className="h-64 md:h-80 w-full bg-gray-200 relative overflow-hidden rounded-b-[3rem]">
        {shop.banner ? (
          <img src={`http://localhost:5000${shop.banner}`} className="w-full h-full object-cover" alt="Banner" />
        ) : (
          <div className="w-full h-full bg-gradient-to-tr from-primary/30 to-accent/30 flex items-center justify-center">
             <Store className="w-24 h-24 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <div className="relative -mt-24 mb-12 bg-white rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-gray-200/50 flex flex-col md:flex-row items-center md:items-start gap-8 border border-gray-100">
          
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border-[6px] border-white shadow-xl overflow-hidden flex-shrink-0 z-10 -mt-12 md:mt-0 relative group">
            {shop.logo ? (
              <img src={`http://localhost:5000${shop.logo}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Logo" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-primary bg-primary/10">{shop.name.charAt(0)}</div>
            )}
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center justify-center md:justify-start">
                  {shop.name}
                  {shop.verified && <CheckCircle className="w-6 h-6 text-blue-500 ml-2 shadow-sm rounded-full bg-white" />}
                </h1>
                <p className="text-primary font-bold text-xs uppercase tracking-widest mt-2 bg-primary/10 inline-block px-3 py-1 rounded-full">{shop.category}</p>
              </div>
              <div className="mt-6 md:mt-0 flex gap-3 justify-center">
                <button className="bg-foreground text-white px-8 py-3 rounded-full font-bold hover:bg-black transition-all flex items-center shadow-lg shadow-black/10 hover:-translate-y-0.5">
                  Follow Shop
                </button>
                <button onClick={handleShare} className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors border border-gray-200">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 max-w-3xl whitespace-pre-line text-sm md:text-base opacity-90">
              {shop.description}
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 text-sm font-semibold text-gray-700 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary" /> {shop.city}</span>
              <span className="text-gray-300">|</span>
              <span className="flex items-center"><Clock className="w-4 h-4 mr-2 text-blue-500" /> {shop.businessHours}</span>
              
              <div className="flex items-center space-x-4 md:ml-auto mt-2 md:mt-0">
                {shop.socialLinks?.instagram && <a href={shop.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors bg-white p-2 rounded-full shadow-sm"><Instagram className="w-4 h-4" /></a>}
                {shop.socialLinks?.facebook && <a href={shop.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors bg-white p-2 rounded-full shadow-sm"><Facebook className="w-4 h-4" /></a>}
                {shop.socialLinks?.whatsapp && <a href={`https://wa.me/${shop.socialLinks.whatsapp}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-green-500 transition-colors bg-white p-2 rounded-full shadow-sm"><Phone className="w-4 h-4" /></a>}
              </div>
            </div>
          </div>
        </div>

        {/* Shop Products Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Grid className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Shop Collection</h2>
            <span className="bg-gray-200 text-gray-700 text-xs font-bold px-3 py-1 rounded-full">{displayedProducts.length}</span>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search in shop..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              />
            </div>
            <div className="relative w-36">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full pl-4 pr-8 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {loading ? renderSkeleton() : displayedProducts.map((product, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 10) * 0.05 }}
              key={product._id} 
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group border border-gray-100 flex flex-col h-full cursor-pointer relative"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden block">
                {product.images?.[0] ? (
                  <img src={`http://localhost:5000${product.images[0]}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.title} />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <Store className="w-8 h-8 mb-2 opacity-20" />
                    <span className="text-xs font-medium">No Image</span>
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <span className="bg-foreground text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">Sold Out</span>
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors flex-1 text-sm md:text-base mb-3">
                  {product.title}
                </h3>
                
                <div className="mt-auto flex justify-between items-end pt-3 border-t border-gray-50">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg text-primary leading-none">₹{product.price}</span>
                  </div>
                  <div className="flex items-center text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-md">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 mr-1" /> 
                    <span>4.9</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!loading && displayedProducts.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-24 text-center bg-white rounded-3xl border border-gray-100 max-w-2xl mx-auto shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">No products found</h3>
            <p className="text-gray-500 mt-2">
              {searchTerm ? "We couldn't find anything matching your search in this shop." : "This shop hasn't listed any products yet."}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-6 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-full transition-colors"
              >
                Clear Search
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
