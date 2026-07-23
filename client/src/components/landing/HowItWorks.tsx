import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Search, ShoppingBag, Check, ChefHat, Truck, Home } from 'lucide-react';

const steps = [
  { icon: Search, title: 'Browse Products', desc: 'Find unique local items in your neighborhood.' },
  { icon: ShoppingBag, title: 'Place Order', desc: 'Securely checkout and support a local creator.' },
  { icon: Check, title: 'Seller Accepts', desc: 'The creator begins preparing your order.' },
  { icon: ChefHat, title: 'Preparing', desc: 'Made fresh and crafted with love.' },
  { icon: Truck, title: 'Out For Delivery', desc: 'On its way to your doorstep.' },
  { icon: Home, title: 'Delivered', desc: 'Enjoy your locally made treasure!' },
];

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="how-it-works" className="py-32 bg-white relative overflow-hidden" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl font-bold tracking-tight mb-4">How it works</h2>
          <p className="text-xl text-foreground/60">From their home to yours in just a few simple steps.</p>
        </motion.div>

        <div className="relative max-w-lg mx-auto">
          {/* Animated Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-100 rounded-full transform md:-translate-x-1/2"></div>
          <motion.div 
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-primary rounded-full transform md:-translate-x-1/2 origin-top"
            style={{ scaleY }}
          ></motion.div>

          {/* Steps */}
          <div className="space-y-12 relative z-10">
            {steps.map((step, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className={`flex items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                >
                  {/* Content */}
                  <div className={`w-full md:w-1/2 pl-20 md:pl-0 ${isEven ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="glass p-6 rounded-3xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                      <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                      <p className="text-foreground/60 text-sm">{step.desc}</p>
                    </div>
                  </div>

                  {/* Icon Node */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-gray-100 flex items-center justify-center z-20">
                    <step.icon className="w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
