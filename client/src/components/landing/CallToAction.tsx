import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CallToAction() {
  return (
    <section className="py-32 relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative rounded-[3rem] overflow-hidden"
      >
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        {/* Glass Content Container */}
        <div className="relative z-10 px-8 py-20 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center space-x-2 py-1.5 px-4 rounded-full bg-white/20 border border-white/30 backdrop-blur-md mb-8">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white font-medium text-sm">Takes less than 5 minutes</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight max-w-3xl leading-tight">
            Ready to turn your passion into a business?
          </h2>
          <p className="text-xl text-white/80 mb-12 max-w-2xl font-medium">
            Join hundreds of local creators building their dream storefronts. Zero upfront costs, low transaction fees, pure connection.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link to="/register" className="px-10 py-5 bg-white text-foreground rounded-full font-bold text-xl hover:bg-gray-50 transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center group relative overflow-hidden">
              <span className="relative z-10 flex items-center">Open Your Free Shop <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" /></span>
            </Link>
          </div>
          
          <p className="mt-8 text-white/60 text-sm">
            No credit card required. Cancel anytime.
          </p>
        </div>
        
        {/* Floating Background Blobs inside CTA */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </motion.div>
    </section>
  );
}
