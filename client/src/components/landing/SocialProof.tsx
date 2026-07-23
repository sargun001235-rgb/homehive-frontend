import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: 'Priya Desai',
    location: 'Bandra West',
    rating: 5,
    purchase: 'Artisan Sourdough Bread',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    text: 'The best sourdough I\'ve ever had! It was still warm when delivered. So much better than store-bought, and I love supporting Sarah\'s Bakehouse.'
  },
  {
    id: 2,
    name: 'Rahul Sharma',
    location: 'Andheri',
    rating: 5,
    purchase: 'Hand-poured Lavender Candle',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100',
    text: 'The scent fills the entire room. Beautiful packaging and a lovely handwritten note from the creator. Will definitely order again for gifts.'
  },
  {
    id: 3,
    name: 'Ananya Patel',
    location: 'Juhu',
    rating: 5,
    purchase: 'Ceramic Coffee Mug',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    text: 'Stunning craftsmanship! It feels so premium and unique. Delivery was super fast since Elena lives just two blocks away.'
  }
];

export default function SocialProof() {
  return (
    <section className="py-32 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">Don't just take our word for it</h2>
          <p className="text-xl text-foreground/60">See what your neighbors are saying about their local purchases.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300 relative"
            >
              <div className="flex space-x-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-foreground/80 leading-relaxed mb-8">"{review.text}"</p>
              
              <div className="flex items-center space-x-4 border-t border-gray-100 pt-6">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-foreground text-sm flex items-center">
                    {review.name}
                  </h4>
                  <p className="text-xs text-foreground/60">{review.location}</p>
                </div>
              </div>
              
              <div className="mt-4 bg-gray-50 px-4 py-2 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs text-foreground/50">Purchased</p>
                  <p className="text-sm font-semibold text-foreground line-clamp-1">{review.purchase}</p>
                </div>
                <div className="flex flex-col items-center ml-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mb-1" />
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Verified</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
