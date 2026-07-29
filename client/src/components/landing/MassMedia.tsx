import { motion } from 'framer-motion';
import { Share2, Instagram, Facebook, Link2, Camera, Video, Smartphone } from 'lucide-react';

export default function MassMedia() {
  return (
    <section className="py-32 bg-gray-50/50 relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-primary/10 via-secondary/5 to-transparent rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center space-x-2 py-1.5 px-3 rounded-full bg-secondary/10 border border-secondary/20 mb-8">
              <Share2 className="w-4 h-4 text-secondary" />
              <span className="text-secondary font-medium text-sm">Powered by Digital Media</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Turn your social media into a <span className="text-gradient">sales engine</span>
            </h2>
            
            <p className="text-xl text-foreground/60 mb-10 leading-relaxed">
              GharSe seamlessly integrates with your existing social presence. Upload rich media, sync with Instagram, and let your customers order directly from WhatsApp.
            </p>
            
            <div className="space-y-6">
              {[
                { icon: Camera, title: 'Beautiful Photo Galleries', desc: 'Showcase your craftsmanship with high-resolution image galleries.' },
                { icon: Video, title: 'Engaging Video Reels', desc: 'Upload behind-the-scenes videos to build trust with buyers.' },
                { icon: Smartphone, title: 'One-Click Sharing', desc: 'Share your shop directly to WhatsApp, Instagram, and Facebook.' }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-start space-x-4 group"
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors group-hover:border-primary">
                    <feature.icon className="w-6 h-6 text-foreground/70 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-lg mb-1">{feature.title}</h4>
                    <p className="text-foreground/60 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-[600px] hidden md:block"
          >
            {/* Center Phone Mockup */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-[280px] h-[580px] bg-white rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden">
              <div className="bg-gray-100 h-full w-full relative">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=400" className="w-full h-1/2 object-cover" alt="Phone App" />
                <div className="p-4 bg-white rounded-t-3xl -mt-6 relative z-10 h-full">
                  <h3 className="font-bold text-lg mb-1">Sarah's Bakehouse</h3>
                  <p className="text-xs text-gray-500 mb-4">gharse.com/sarahsbakehouse</p>
                  <div className="flex space-x-2 mb-4">
                    <button className="flex-1 bg-primary text-white py-2 rounded-xl text-sm font-semibold">Share Shop</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Connection Nodes */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-0 z-30 glass p-4 rounded-2xl shadow-xl flex items-center space-x-3"
            >
              <div className="bg-pink-100 p-2 rounded-full text-pink-500"><Instagram className="w-6 h-6" /></div>
              <span className="font-semibold text-sm">Sync Posts</span>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 right-0 z-30 glass p-4 rounded-2xl shadow-xl flex items-center space-x-3"
            >
              <div className="bg-blue-100 p-2 rounded-full text-blue-500"><Facebook className="w-6 h-6" /></div>
              <span className="font-semibold text-sm">Reach Locals</span>
            </motion.div>

            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-1/2 -left-10 z-30 glass p-4 rounded-2xl shadow-xl flex items-center space-x-3"
            >
              <div className="bg-green-100 p-2 rounded-full text-green-500"><Link2 className="w-6 h-6" /></div>
              <span className="font-semibold text-sm">WhatsApp Orders</span>
            </motion.div>
            
          </motion.div>

        </div>
      </div>
    </section>
  );
}
