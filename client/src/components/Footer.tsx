import { Store, Instagram, Twitter, Facebook, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-24 pb-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-5">
            <Link to="/" className="flex items-center space-x-2 mb-6 group">
              <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-foreground">
                GharSe
              </span>
            </Link>
            <p className="text-foreground/70 max-w-sm mb-8 text-lg leading-relaxed">
              Empowering local home-based entrepreneurs to build their brands and reach nearby customers with beautiful storefronts.
            </p>
            <div className="flex space-x-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-6">Marketplace</h3>
            <ul className="space-y-4">
              {['Home Bakers', 'Artists', 'Crafters', 'Local Produce', 'Handmade Gifts'].map(link => (
                <li key={link}><a href="#" className="text-foreground/60 hover:text-primary transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="font-semibold text-foreground mb-6">For Sellers</h3>
            <ul className="space-y-4">
              {['Open a Shop', 'Seller Guide', 'Pricing', 'Success Stories', 'Community'].map(link => (
                <li key={link}><a href="#" className="text-foreground/60 hover:text-primary transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="font-semibold text-foreground mb-6">Stay Updated</h3>
            <p className="text-foreground/60 mb-4">Get the latest from your local creators directly in your inbox.</p>
            <div className="flex bg-gray-50 p-1 rounded-full border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <input type="email" placeholder="Email address" className="bg-transparent border-none outline-none px-4 py-2 w-full text-foreground text-sm" />
              <button className="bg-foreground text-white rounded-full p-2 hover:bg-primary transition-colors">
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground/50 text-sm">
            © {new Date().getFullYear()} GharSe Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-foreground/50">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <span className="flex items-center">
              Made with <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" /> for local creators
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
