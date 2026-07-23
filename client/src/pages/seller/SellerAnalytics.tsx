import { BarChart2, TrendingUp, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SellerAnalytics() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics Overview</h1>
            <p className="text-foreground/60 text-sm">Track your shop's performance</p>
          </div>
          <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none">
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-full">+12.5%</span>
            </div>
            <p className="text-sm font-semibold text-foreground/60 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-foreground">₹24,500</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-full">+5.2%</span>
            </div>
            <p className="text-sm font-semibold text-foreground/60 mb-1">Store Visits</p>
            <h3 className="text-3xl font-bold text-foreground">1,248</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl">
                <TrendingUp className="w-6 h-6" />
              </div>
              <span className="text-sm font-bold text-green-500 bg-green-50 px-2.5 py-1 rounded-full">+18.1%</span>
            </div>
            <p className="text-sm font-semibold text-foreground/60 mb-1">Orders</p>
            <h3 className="text-3xl font-bold text-foreground">42</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                <BarChart2 className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground/60 mb-1">Conversion Rate</p>
            <h3 className="text-3xl font-bold text-foreground">3.4%</h3>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-white p-12 rounded-3xl border border-gray-200 shadow-sm text-center">
          <BarChart2 className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground">Advanced Analytics Coming Soon</h3>
          <p className="text-gray-500 mt-2 max-w-md mx-auto">Detailed charts and graphs of your store's performance will be available in the next major update.</p>
        </motion.div>
      </div>
    </div>
  );
}
