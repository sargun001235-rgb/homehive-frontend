import { Link } from 'react-router-dom';
import { Store, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'py-2 glass shadow-sm' : 'py-4 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
              <Store className="h-7 w-7 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-foreground">
              HomeHive
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {['Marketplace', 'Sellers', 'How it Works', 'Community'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-foreground/80 font-medium hover:text-primary transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full rounded-full"></span>
              </a>
            ))}
            <div className="w-px h-6 bg-gray-200"></div>
            {isAuthenticated ? (
              <Link to={`/dashboard/${user?.role}`} className="bg-foreground text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary transition-all transform hover:scale-105 shadow-lg flex items-center group">
                <span>Dashboard</span>
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-foreground font-medium hover:text-primary transition-colors">Log In</Link>
                <Link to="/register" className="bg-foreground text-white px-6 py-2.5 rounded-full font-medium hover:bg-primary transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 flex items-center group">
                  <span>Open a Shop</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-foreground p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <motion.div animate={{ rotate: isOpen ? 90 : 0 }}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass border-t border-white/20 absolute w-full"
          >
            <div className="px-4 py-6 space-y-4 flex flex-col bg-white/50 backdrop-blur-3xl shadow-xl">
              {['Marketplace', 'Sellers', 'How it Works', 'Community'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="block px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors" 
                  onClick={() => setIsOpen(false)}
                >
                  {item}
                </a>
              ))}
              <div className="h-px w-full bg-gray-200 my-4"></div>
              {isAuthenticated ? (
                <Link to={`/dashboard/${user?.role}`} className="w-full bg-foreground text-white px-6 py-4 rounded-2xl font-semibold mt-2 shadow-lg hover:bg-primary transition-colors text-center block" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="block w-full text-left px-3 py-2 text-base font-semibold text-foreground hover:text-primary transition-colors" onClick={() => setIsOpen(false)}>
                    Log In
                  </Link>
                  <Link to="/register" className="w-full bg-foreground text-white px-6 py-4 rounded-2xl font-semibold mt-2 shadow-lg shadow-gray-200 hover:bg-primary transition-colors text-center block" onClick={() => setIsOpen(false)}>
                    Open a Shop
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
