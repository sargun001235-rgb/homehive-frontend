import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';

const posts = [
  {
    id: 1,
    seller: 'Sarah\'s Bakehouse',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600',
    likes: 124,
    comments: 12,
    caption: 'Fresh batch of double chocolate chip cookies just out of the oven! 🍪 Available for local pickup until 6PM today. #HomeBaking #LocalGoodness'
  },
  {
    id: 2,
    seller: 'Art by Maya',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=600',
    likes: 89,
    comments: 5,
    caption: 'Just finished this custom abstract piece for a client in Bandra. My commissions for next month are now open! 🎨✨ #AbstractArt #LocalArtist'
  },
  {
    id: 3,
    seller: 'Lumina Scents',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=600',
    likes: 215,
    comments: 24,
    caption: 'Festival offer is live! 🎁 Get our limited edition Sandalwood & Rose candle sets. Perfect for gifting. Only 20 sets remaining. #HandmadeCandles'
  }
];

export default function CommunityFeed() {
  return (
    <section id="community" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <h2 className="text-4xl font-bold tracking-tight mb-4">Community Feed</h2>
            <p className="text-xl text-foreground/60">See what's happening in your local creator community right now.</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-4 flex items-center space-x-3">
                <img src={post.avatar} alt={post.seller} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                <span className="font-bold text-foreground text-sm">{post.seller}</span>
              </div>
              
              <div className="aspect-square overflow-hidden bg-gray-50">
                <img src={post.image} alt="Post" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-4">
                    <button className="text-foreground hover:text-red-500 transition-colors"><Heart className="w-6 h-6" /></button>
                    <button className="text-foreground hover:text-primary transition-colors"><MessageCircle className="w-6 h-6" /></button>
                    <button className="text-foreground hover:text-primary transition-colors"><Send className="w-6 h-6" /></button>
                  </div>
                  <button className="text-foreground hover:text-primary transition-colors"><Bookmark className="w-6 h-6" /></button>
                </div>
                
                <p className="font-bold text-sm mb-2">{post.likes.toLocaleString()} likes</p>
                <p className="text-sm text-foreground/80 leading-relaxed mb-2">
                  <span className="font-bold text-foreground mr-2">{post.seller}</span>
                  {post.caption}
                </p>
                <p className="text-xs text-foreground/50 cursor-pointer hover:underline">View all {post.comments} comments</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
