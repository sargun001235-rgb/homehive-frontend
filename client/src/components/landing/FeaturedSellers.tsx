import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

const sellers = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    shop: 'Sarah\'s Bakehouse',
    category: 'Home Baker',
    followers: '1.2k',
    products: 24,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=300',
    cover: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 2,
    name: 'Marcus Thorne',
    shop: 'Thorne Woodworks',
    category: 'Woodworker',
    followers: '850',
    products: 12,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300',
    cover: 'https://images.unsplash.com/photo-1610447193649-65005b821430?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 3,
    name: 'Elena Rostova',
    shop: 'Elena Ceramics',
    category: 'Ceramics Artist',
    followers: '2.1k',
    products: 45,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    cover: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=600'
  }
];

export default function FeaturedSellers() {
  return (
    <section id="sellers" className="py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">Meet the creators</h2>
          <p className="text-xl text-foreground/60">The passionate individuals behind your favorite local products.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sellers.map((seller, index) => (
            <motion.div
              key={seller.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group"
            >
              <div className="h-32 relative overflow-hidden">
                <img src={seller.cover} alt="Cover" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              <div className="px-6 pb-6 relative">
                <div className="flex justify-between items-end mb-4">
                  <div className="-mt-12 relative rounded-full p-1 bg-white inline-block">
                    <img src={seller.image} alt={seller.name} className="w-20 h-20 rounded-full object-cover" />
                    <div className="absolute bottom-1 right-1 bg-white rounded-full">
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                  <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-foreground text-sm font-semibold rounded-full transition-colors">
                    Follow
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-foreground">{seller.shop}</h3>
                  <p className="text-foreground/60 text-sm">{seller.name} • {seller.category}</p>
                </div>
                
                <div className="flex items-center justify-between py-4 border-t border-gray-100">
                  <div className="text-center">
                    <p className="font-bold text-foreground">{seller.followers}</p>
                    <p className="text-xs text-foreground/50 font-medium">Followers</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="text-center">
                    <p className="font-bold text-foreground flex items-center justify-center">
                      {seller.products}
                    </p>
                    <p className="text-xs text-foreground/50 font-medium">Products</p>
                  </div>
                  <div className="w-px h-8 bg-gray-100"></div>
                  <div className="text-center">
                    <p className="font-bold text-foreground flex items-center justify-center">
                      {seller.rating} <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 ml-1" />
                    </p>
                    <p className="text-xs text-foreground/50 font-medium">Rating</p>
                  </div>
                </div>
                
                <button className="w-full py-3 bg-white border border-gray-200 text-foreground rounded-2xl font-semibold hover:border-primary hover:text-primary transition-colors group-hover:bg-primary group-hover:text-white group-hover:border-primary">
                  View Shop
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
