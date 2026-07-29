import { useState, useEffect, useRef } from 'react';
import { Search, Store, ArrowLeft, User, LogOut, ShoppingBag, AlertCircle, ChevronDown, Check, SlidersHorizontal, MapPin, Heart, Package } from 'lucide-react';
import { useProductStore } from '../../store/useProductStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useAddressStore } from '../../store/useAddressStore';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ['All', 'Home Bakery', 'Handmade Crafts', 'Jewelry', 'Art & Paintings', 'Cloud Kitchen'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-low-high', label: 'Price: Low to High' },
  { value: 'price-high-low', label: 'Price: High to Low' },
  { value: 'oldest', label: 'Oldest' }
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { marketplaceProducts, fetchMarketplaceProducts, isLoading, addRecentlyViewed } = useProductStore();
  const { customerOrders, fetchCustomerOrders, isLoading: loadingOrders } = useOrderStore();
  const { wishlistProducts, fetchWishlist, isLoading: loadingWishlist, removeFromWishlist } = useWishlistStore();
  const { addresses, fetchAddresses, isLoading: loadingAddresses, deleteAddress } = useAddressStore();
  
  const [activeTab, setActiveTab] = useState('marketplace');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [city, setCity] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [inStock, setInStock] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetchCustomerOrders();
    fetchWishlist();
    fetchAddresses();
  }, [fetchCustomerOrders, fetchWishlist, fetchAddresses]);

  useEffect(() => {
    const params: any = {};
    if (activeCategory !== 'All') params.category = activeCategory;
    if (searchTerm) params.search = searchTerm;
    if (city) params.city = city;
    if (sortBy !== 'newest') params.sortBy = sortBy;
    if (inStock) params.inStock = 'true';
    if (priceRange.min) params.minPrice = priceRange.min;
    if (priceRange.max) params.maxPrice = priceRange.max;
    
    const timer = setTimeout(() => {
      fetchMarketplaceProducts(params);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [activeCategory, searchTerm, city, sortBy, inStock, priceRange, fetchMarketplaceProducts]);

  const renderSkeleton = () => (
    Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[320px] animate-pulse">
        <div className="h-48 md:h-56 bg-gray-200 w-full" />
        <div className="p-4 flex flex-col flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
          <div className="mt-auto flex justify-between items-center pt-3 border-t border-gray-50">
            <div className="h-5 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-10" />
          </div>
        </div>
      </div>
    ))
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">
                GharSe
              </span>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl px-4 lg:px-12">
             <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text"
                  placeholder="Search for cakes, art, crafts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium"
                />
              </div>
          </div>

          <div className="relative flex items-center gap-2" ref={dropdownRef}>
            <button onClick={() => navigate('/cart')} className="p-2.5 rounded-full text-gray-600 hover:bg-gray-100 transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2.5 rounded-full transition-colors flex items-center gap-2 text-sm font-medium ${isFilterOpen ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:block">Filters</span>
            </button>

            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors border border-primary/20"
            >
              <User className="w-5 h-5" />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-12 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                    <p className="font-bold text-foreground truncate">{user?.name || 'Customer'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'customer@example.com'}</p>
                  </div>
                  
                  <div className="p-2">
                    <button onClick={() => { setIsDropdownOpen(false); setActiveTab('orders'); }} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span>My Orders</span>
                    </button>
                    <button onClick={() => { setIsDropdownOpen(false); setActiveTab('wishlist'); }} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                      <Heart className="w-4 h-4 text-gray-400" />
                      <span>Wishlist</span>
                    </button>
                    <button onClick={() => { setIsDropdownOpen(false); setActiveTab('addresses'); }} className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>Saved Addresses</span>
                    </button>
                  </div>
                  
                  <div className="p-2 border-t border-gray-50">
                    <button 
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setShowLogoutConfirm(true);
                      }}
                      className="flex w-full items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm font-bold text-red-600 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-100 bg-white">
          <div className="flex space-x-8 overflow-x-auto scrollbar-hide">
            <button 
              onClick={() => setActiveTab('marketplace')} 
              className={`py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'marketplace' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              Marketplace
            </button>
            <button 
              onClick={() => setActiveTab('orders')} 
              className={`py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              Recent Orders
            </button>
            <button 
              onClick={() => setActiveTab('wishlist')} 
              className={`py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'wishlist' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              Wishlist
            </button>
            <button 
              onClick={() => setActiveTab('addresses')} 
              className={`py-4 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${activeTab === 'addresses' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-900'}`}
            >
              Saved Addresses
            </button>
          </div>
        </div>

        {/* Expandable Filter Section (Only in Marketplace) */}
        <AnimatePresence>
          {isFilterOpen && activeTab === 'marketplace' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-gray-100 bg-white overflow-hidden shadow-sm"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" placeholder="e.g. Mumbai" value={city} onChange={(e) => setCity(e.target.value)} className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Sort By</label>
                  <div className="relative">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full pl-3 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none appearance-none transition-all">
                      {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price Range (₹)</label>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                    <span className="text-gray-400">-</span>
                    <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Availability</label>
                  <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${inStock ? 'bg-primary border-primary' : 'border border-gray-300 bg-white'}`}>
                      {inStock && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">In Stock Only</span>
                    <input type="checkbox" className="hidden" checked={inStock} onChange={(e) => setInStock(e.target.checked)} />
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* MARKETPLACE TAB */}
        {activeTab === 'marketplace' && (
          <>
            <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {activeCategory === 'All' ? 'Discover Local Gems' : `${activeCategory} Near You`}
                </h2>
                <p className="text-sm text-gray-500 mt-1">Showing {marketplaceProducts.length} premium selections</p>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                      activeCategory === cat 
                        ? 'bg-foreground text-white shadow-md' 
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? renderSkeleton() : marketplaceProducts.map((product, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={product._id} 
                  onClick={() => {
                    addRecentlyViewed(product);
                    navigate(`/product/${product._id}`);
                  }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group border border-gray-100 flex flex-col h-full cursor-pointer relative"
                >
                  <div className="relative h-48 md:h-56 bg-gray-100 overflow-hidden block">
                    {product.images?.[0] ? (
                      <img src={`${product.images[0]}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={product.title} />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                        <Store className="w-8 h-8 mb-2 opacity-20" />
                        <span className="text-xs font-medium">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {product.stock === 0 && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                        <span className="bg-foreground text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">Sold Out</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors flex-1 text-sm md:text-base mb-1">
                      {product.title}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-xs text-foreground/60 mb-4">
                      {product.shopId?.logo ? <img src={`${product.shopId.logo}`} className="w-4 h-4 rounded-full border border-gray-200" /> : <Store className="w-3 h-3" />}
                      <span className="truncate hover:text-primary transition-colors">{product.shopId?.name || 'Local Seller'}</span>
                      {product.shopId?.verified && <Check className="w-3 h-3 text-blue-500 ml-1" />}
                    </div>
                    <div className="mt-auto flex justify-between items-end pt-3 border-t border-gray-50">
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-primary leading-none">₹{product.price}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {marketplaceProducts.length === 0 && !isLoading && (
              <div className="py-16 flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="relative w-32 h-32 mb-8 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-75"></div>
                  <div className="relative bg-white rounded-full p-6 shadow-xl border border-gray-100 flex items-center justify-center z-10">
                    <Store className="w-16 h-16 text-primary" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">No products available yet.</h3>
                <p className="text-gray-500 mb-8 text-lg">Be the first seller to publish a product.</p>
              </div>
            )}
          </>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Recent Orders</h2>
            {loadingOrders ? (
              <div className="animate-pulse space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-24 bg-gray-200 rounded-2xl w-full" />)}
              </div>
            ) : customerOrders.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No orders found</h3>
                <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <button onClick={() => setActiveTab('marketplace')} className="px-6 py-3 bg-primary text-white rounded-full font-bold">Browse Marketplace</button>
              </div>
            ) : (
              <div className="space-y-4">
                {customerOrders.map(order => (
                  <div key={order._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                      <h4 className="font-bold text-foreground text-lg mb-1">{order.orderNumber}</h4>
                      <p className="text-sm text-gray-500 mb-3">{new Date(order.createdAt).toLocaleDateString()} • {order.items.length} items</p>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {order.status}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">Total: ₹{order.totalAmount}</span>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex gap-2">
                      <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">My Wishlist</h2>
            {loadingWishlist ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {renderSkeleton().slice(0,4)}
              </div>
            ) : wishlistProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Your wishlist is empty</h3>
                <p className="text-gray-500 mb-6">Save items you love to view them later.</p>
                <button onClick={() => setActiveTab('marketplace')} className="px-6 py-3 bg-primary text-white rounded-full font-bold">Explore Products</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistProducts.map(product => (
                  <div key={product._id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full relative group">
                    <button 
                      onClick={() => removeFromWishlist(product._id)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 hover:bg-white shadow-sm"
                    >
                      <Heart className="w-4 h-4 fill-red-500" />
                    </button>
                    <div className="relative h-48 bg-gray-100 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${product._id}`)}>
                      {product.images?.[0] && <img src={`${product.images[0]}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h3 className="font-bold text-foreground line-clamp-1 mb-2">{product.title}</h3>
                      <span className="font-bold text-lg text-primary mt-auto">₹{product.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">Saved Addresses</h2>
              <button className="px-4 py-2 bg-primary text-white rounded-lg font-bold text-sm shadow-sm">Add New Address</button>
            </div>
            {loadingAddresses ? (
              <div className="animate-pulse h-32 bg-gray-200 rounded-2xl w-full" />
            ) : addresses.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">No addresses saved</h3>
                <p className="text-gray-500 mb-6">Add an address for faster checkout.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(address => (
                  <div key={address._id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm relative">
                    {address.isDefault && (
                      <span className="absolute top-4 right-4 bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">Default</span>
                    )}
                    <h4 className="font-bold text-lg mb-1">{address.fullName}</h4>
                    <p className="text-gray-500 mb-1">{address.phoneNumber}</p>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {address.addressLine}<br />
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    <div className="flex gap-2 border-t border-gray-100 pt-4">
                      <button className="text-sm font-bold text-gray-600 hover:text-primary">Edit</button>
                      <button onClick={() => deleteAddress(address._id)} className="text-sm font-bold text-red-500 hover:text-red-700 ml-4">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Logout Confirmation */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-sm border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500"><AlertCircle className="w-6 h-6" /></div>
                <h3 className="text-xl font-bold text-foreground mb-2">Sign Out</h3>
                <p className="text-gray-500 text-sm mb-6">Are you sure you want to sign out?</p>
                <div className="flex w-full gap-3">
                  <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 py-3 px-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                  <button onClick={() => { logout(); navigate('/login'); }} className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600">Sign Out</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
