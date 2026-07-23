import { motion } from 'framer-motion';
import { ArrowRight, Star, CheckCircle, Clock, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const floatAnimation = {
  y: [0, -15, 0],
  transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const }
};

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full min-h-screen flex items-center">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center relative z-10 w-full">
        
        {/* Left Side: Typography */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="max-w-2xl"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center space-x-2 py-1.5 px-3 rounded-full bg-primary/10 border border-primary/20 mb-8 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-primary font-medium text-sm">Now available in 12 cities</span>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              The premium <br />
              <span className="text-gradient">local marketplace</span>
            </h1>
          </motion.div>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-foreground/60 mb-10 leading-relaxed max-w-xl">
            Discover extraordinary handmade products, baked goods, and art from talented creators right in your neighborhood. Stop scrolling global feeds, start shopping local.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-foreground text-white rounded-full font-semibold text-lg hover:bg-primary transition-all transform hover:scale-105 shadow-xl shadow-gray-200 hover:shadow-primary/30 flex items-center justify-center group relative overflow-hidden">
              <span className="relative z-10 flex items-center">Explore Shops <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></span>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-foreground border border-gray-200 rounded-full font-semibold text-lg hover:bg-gray-50 transition-all hover:shadow-md flex items-center justify-center">
              Become a Seller
            </Link>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="mt-12 flex items-center space-x-4 text-sm text-foreground/50 font-medium">
            <div className="flex -space-x-2">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100&h=100" className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="User" />
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100&h=100" className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="User" />
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100" className="w-8 h-8 rounded-full border-2 border-white object-cover" alt="User" />
            </div>
            <p>Join 4,500+ locals already shopping</p>
          </motion.div>
        </motion.div>

        {/* Right Side: Floating Mockup */}
        <div className="relative h-[600px] hidden lg:block">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl opacity-50"></div>
          
          {/* Main Card */}
          <motion.div 
            animate={floatAnimation}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-80 glass p-4 rounded-3xl shadow-2xl"
          >
            <div className="relative rounded-2xl overflow-hidden mb-4 group cursor-pointer">
              <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=800" alt="Chocolate Cake" className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-foreground flex items-center shadow-sm">
                <Clock className="w-3 h-3 mr-1" /> Fresh Today
              </div>
              <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center hover:text-red-500 hover:scale-110 transition-all shadow-sm">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-foreground">Artisan Chocolate Cake</h3>
                <span className="font-bold text-primary">₹799</span>
              </div>
              <div className="flex items-center space-x-1 text-sm text-foreground/60 mb-3">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">4.9</span>
                <span>(128 reviews)</span>
              </div>
              <div className="flex items-center space-x-2 pt-3 border-t border-gray-100">
                <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100&h=100" className="w-6 h-6 rounded-full object-cover" alt="Seller" />
                <span className="text-xs font-medium">Sarah's Bakehouse</span>
                <CheckCircle className="w-3 h-3 text-blue-500" />
              </div>
            </div>
          </motion.div>

          {/* Floating Badge 1 */}
          <motion.div 
            animate={{ y: [0, -10, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" as const, delay: 1 } }}
            className="absolute top-20 left-10 z-30 glass-dark py-2 px-4 rounded-full flex items-center space-x-2 shadow-xl"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-white text-sm font-medium">Verified Seller</span>
          </motion.div>

          {/* Floating Badge 2 */}
          <motion.div 
            animate={{ y: [0, 15, 0], transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const, delay: 2 } }}
            className="absolute bottom-32 -left-4 z-30 glass py-3 px-4 rounded-2xl flex items-center space-x-3 shadow-xl border border-white/50"
          >
            <div className="bg-orange-100 p-2 rounded-full">
              <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
            </div>
            <div>
              <p className="text-xs text-foreground/60 font-medium">Top Rated</p>
              <p className="text-sm font-bold text-foreground">5.0 Average</p>
            </div>
          </motion.div>

          {/* Floating Badge 3 */}
          <motion.div 
            animate={{ y: [0, -20, 0], transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const, delay: 0.5 } }}
            className="absolute top-40 right-4 z-10 glass py-3 px-4 rounded-2xl shadow-xl flex items-center space-x-3"
          >
            <img src="https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=100&h=100" className="w-10 h-10 rounded-full object-cover border border-white" alt="Pottery" />
            <div>
              <p className="text-xs font-bold text-foreground line-clamp-1">Handmade Vase</p>
              <p className="text-xs text-primary font-bold">₹1299</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
