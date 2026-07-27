import { useEffect, useState } from 'react';
import { BarChart2, TrendingUp, Users, DollarSign, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAnalyticsStore } from '../../store/useAnalyticsStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SellerAnalytics() {
  const { 
    totalRevenue, 
    totalOrders, 
    visitors, 
    conversionRate, 
    salesGraph, 
    topProducts, 
    isLoading, 
    fetchAnalytics 
  } = useAnalyticsStore();

  const [timeRange, setTimeRange] = useState('All Time'); // Since we didn't add time filtering on backend yet

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-gray-200 shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics Overview</h1>
            <p className="text-foreground/60 text-sm">Track your shop's performance</p>
          </div>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-primary transition-colors cursor-pointer"
          >
            <option>All Time</option>
          </select>
        </div>

        {/* Top KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-50 text-green-500 rounded-2xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground/60 mb-1">Total Revenue</p>
            <h3 className="text-3xl font-bold text-foreground">₹{totalRevenue.toLocaleString()}</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-50 text-purple-500 rounded-2xl">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground/60 mb-1">Total Orders</p>
            <h3 className="text-3xl font-bold text-foreground">{totalOrders.toLocaleString()}</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground/60 mb-1">Estimated Visitors</p>
            <h3 className="text-3xl font-bold text-foreground">{visitors.toLocaleString()}</h3>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
                <BarChart2 className="w-6 h-6" />
              </div>
            </div>
            <p className="text-sm font-semibold text-foreground/60 mb-1">Conversion Rate</p>
            <h3 className="text-3xl font-bold text-foreground">{conversionRate}%</h3>
          </motion.div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Revenue Over Time Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }} 
            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm lg:col-span-2"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground">Revenue & Orders</h3>
              <p className="text-sm text-gray-500">Monthly performance metrics</p>
            </div>
            
            <div className="h-[350px] w-full">
              {salesGraph.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesGraph} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
                    <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `₹${value}`} />
                    <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                      formatter={(value: any, name: any) => [name === 'revenue' ? `₹${value}` : value, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
                    <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={3} fillOpacity={0} />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <BarChart2 className="w-12 h-12 mb-3 opacity-20" />
                  <p>Not enough data to generate chart</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }} 
            className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-foreground">Top Products</h3>
              <p className="text-sm text-gray-500">By sales volume</p>
            </div>

            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 mr-4">
                      {product.image ? (
                        <img src={`http://localhost:5000${product.image}`} alt={product.title} className="w-full h-full object-cover" />
                      ) : (
                        <Package className="w-6 h-6 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                      )}
                      <div className="absolute top-0 left-0 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-br-lg z-10">
                        #{index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-foreground truncate">{product.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{product.soldQuantity} sold</p>
                    </div>
                    
                    <div className="text-right ml-2">
                      <p className="text-sm font-bold text-green-600">₹{product.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400 text-sm">
                  <Package className="w-10 h-10 mb-2 opacity-20" />
                  <p>No products sold yet</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
