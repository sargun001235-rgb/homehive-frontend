import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Store, Star, Share2, Heart, ArrowLeft, CheckCircle, Clock, ShieldCheck, User } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ShoppingBag, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';
import { Product } from '../../store/useProductStore';
import ReviewSection from '../../components/ReviewSection';

const ProductDetails = React.memo(function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      setLoading(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const { data } = await api.get(`/product/${id}`);
        setProduct(data);
        
        if (data.category) {
          const res = await api.get('/product', { params: { category: data.category } });
          const filtered = res.data.filter((p: Product) => p._id !== data._id).slice(0, 4);
          setRelatedProducts(filtered);
        }
      } catch (error) {
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [id]);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  }, [isZoomed]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading product details...</p>
      </div>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
      <Store className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h2>
      <p className="text-gray-500 mb-6">This product might have been removed or is currently unavailable.</p>
      <button onClick={() => navigate('/dashboard/customer')} className="px-6 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors">
        Back to Marketplace
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center text-sm font-bold text-gray-500 hover:text-primary transition-colors mb-6 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden mb-12"
        >
          <div className="flex flex-col lg:flex-row">
            
            {/* Image Gallery */}
            <div className="w-full lg:w-1/2 p-6 md:p-8 bg-gray-50/50 flex flex-col">
              <div 
                className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-gray-100 shadow-sm mb-6 cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
              >
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={`http://localhost:5000${product.images[activeImage]}`} 
                    className="w-full h-full object-cover transition-transform duration-200 ease-out" 
                    style={{
                      transform: isZoomed ? 'scale(2)' : 'scale(1)',
                      transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`
                    }}
                    alt={product.title} 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 bg-gray-50 font-medium">
                    <Store className="w-12 h-12 mb-2 opacity-20" />
                    No Image Available
                  </div>
                )}
                {product.stock === 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                    Out of Stock
                  </div>
                )}
              </div>
              
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide mt-auto">
                  {product.images.map((img: string, idx: number) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImage(idx)}
                      aria-label={`View image ${idx + 1}`}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${activeImage === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300 opacity-70 hover:opacity-100'}`}
                    >
                      <img src={`http://localhost:5000${img}`} className="w-full h-full object-cover" alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="w-full lg:w-1/2 p-6 md:p-10 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <span className="text-primary font-bold text-xs tracking-widest uppercase bg-primary/10 px-3 py-1 rounded-full">{product.category}</span>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product._id)} 
                    aria-label={isInWishlist(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm border border-gray-100 ${isInWishlist(product._id) ? 'bg-red-50 text-red-500 border-red-100' : 'bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-red-50'}`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product._id) ? 'fill-red-500' : ''}`} />
                  </button>
                  <button onClick={handleShare} aria-label="Share product" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-colors shadow-sm border border-gray-100">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">{product.title}</h1>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center text-sm font-bold bg-yellow-50 text-yellow-700 px-2 py-1 rounded-md">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                  <span>4.9</span>
                </div>
                <span className="text-gray-400 text-sm font-medium underline decoration-dashed underline-offset-4 cursor-pointer hover:text-gray-600 transition-colors">128 Reviews</span>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Unavailable'}
                </span>
              </div>

              <div className="text-5xl font-bold text-foreground mb-8">₹{product.price}</div>

              <div className="prose prose-sm text-gray-600 mb-10 max-w-none">
                <h3 className="text-lg font-bold text-foreground mb-3">Description</h3>
                <p className="whitespace-pre-line leading-relaxed text-[15px] opacity-90">{product.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="font-medium">Secure Quality</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">Fast Local Response</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="flex items-center bg-gray-50 rounded-xl border border-gray-200 p-1 w-full sm:w-auto h-[60px]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    aria-label="Increase quantity"
                    className="w-12 h-full flex items-center justify-center text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                
                <button 
                  onClick={() => addToCart(product._id, quantity)} 
                  disabled={product.stock === 0}
                  className="flex-1 h-[60px] bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" /> 
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>

              {/* Seller & Shop Info Card */}
              <div className="mt-auto bg-gray-50 rounded-2xl p-5 border border-gray-200">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Sold By</h3>
                
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex items-center justify-center">
                      {product.shopId.logo ? (
                        <img src={`http://localhost:5000${product.shopId.logo}`} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground flex items-center mb-0.5">
                        {product.shopId.name}
                        {product.shopId.verified && <CheckCircle className="w-4 h-4 text-blue-500 ml-1.5" />}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center mb-2">
                        <MapPin className="w-3.5 h-3.5 mr-1" /> {product.shopId.city}
                      </p>
                      {product.sellerId && (
                        <div className="flex items-center text-xs text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-100 inline-flex">
                          <User className="w-3 h-3 mr-1" /> {product.sellerId.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <Link to={`/shop/${product.shopId._id}`} className="px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-primary hover:text-primary shadow-sm transition-all">
                    Visit Shop
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <ReviewSection productId={product._id} />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">More like this</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group border border-gray-100 cursor-pointer"
                >
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {p.images?.[0] ? (
                      <img src={`http://localhost:5000${p.images[0]}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={p.title} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors mb-2">{p.title}</h3>
                    <span className="font-bold text-primary">₹{p.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

export default ProductDetails;
