import { Outlet, Link } from 'react-router-dom';
import { Store, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Mesh & Globs */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]" />
      <div className="fixed inset-0 z-0 opacity-50" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      {/* Floating Animated Blobs */}
      <div className="blob bg-primary/20 w-[600px] h-[600px] rounded-full top-[-10%] left-[-10%] mix-blend-multiply" style={{ animationDelay: '0s' }}></div>
      <div className="blob bg-secondary/20 w-[500px] h-[500px] rounded-full bottom-[-10%] right-[-10%] mix-blend-multiply" style={{ animationDelay: '2s' }}></div>

      <div className="absolute top-8 left-8 z-20">
        <Link to="/" className="flex items-center text-foreground/60 hover:text-foreground font-medium transition-colors">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 z-10 p-4 sm:p-6 lg:p-8 items-center min-h-screen lg:min-h-[auto]">
        
        {/* Left Side: Branding */}
        <div className="hidden lg:flex flex-col justify-center h-full pr-12">
          <Link to="/" className="flex items-center space-x-3 mb-10 group w-fit">
            <div className="bg-primary/10 p-3 rounded-2xl group-hover:bg-primary/20 transition-colors">
              <Store className="h-10 w-10 text-primary" />
            </div>
            <span className="text-4xl font-bold tracking-tight text-foreground">
              GharSe
            </span>
          </Link>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6 leading-tight">
              Join the <span className="text-gradient">local commerce</span> revolution.
            </h1>
            <p className="text-xl text-foreground/60 leading-relaxed">
              Discover extraordinary products, connect with passionate creators, and support your neighborhood.
            </p>
          </motion.div>
        </div>

        {/* Right Side: Auth Forms */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto lg:mx-0 glass rounded-3xl p-8 sm:p-10 shadow-2xl relative"
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
}
