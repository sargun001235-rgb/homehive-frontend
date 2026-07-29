import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, ChevronDown, Check, X, Clock, Truck } from 'lucide-react';
import { useOrderStore } from '../../store/useOrderStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrderManagement() {
  const { sellerOrders, fetchSellerOrders, updateOrderStatus, isLoading } = useOrderStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetchSellerOrders();
  }, [fetchSellerOrders]);

  const handleUpdateStatus = (id: string, status: string) => {
    updateOrderStatus(id, status);
  };

  const filteredOrders = sellerOrders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Preparing': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Out for Delivery': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Management</h1>
          <p className="text-gray-500">Manage incoming orders, update statuses, and prepare shipments.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by order ID or customer name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="relative w-full sm:w-64">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl appearance-none outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-gray-700"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Preparing">Preparing</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        </div>
      </div>

      {/* Modern Data Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-medium text-gray-500">No orders found.</p>
                  </td>
                </tr>
              ) : filteredOrders.map(order => (
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-gray-50/50 transition-colors group">
                    <td className="p-4 font-bold text-foreground">
                      <button onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)} className="hover:text-primary transition-colors flex items-center gap-2">
                        {order.orderNumber}
                        <ChevronDown className={`w-4 h-4 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-800">{order.customer.name}</div>
                      <div className="text-xs text-gray-500">{order.customer.email}</div>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-bold text-primary">₹{order.totalAmount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {order.status === 'Pending' && (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleUpdateStatus(order._id, 'Confirmed')} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors" title="Accept Order">
                            <Check className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleUpdateStatus(order._id, 'Cancelled')} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors" title="Reject Order">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {order.status === 'Confirmed' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Preparing')} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 ml-auto">
                          <Clock className="w-3 h-3" /> Start Preparing
                        </button>
                      )}
                      {order.status === 'Preparing' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Out for Delivery')} className="px-3 py-1.5 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 ml-auto">
                          <Truck className="w-3 h-3" /> Ship Order
                        </button>
                      )}
                      {order.status === 'Out for Delivery' && (
                        <button onClick={() => handleUpdateStatus(order._id, 'Delivered')} className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors text-xs font-bold flex items-center gap-1 ml-auto">
                          <Check className="w-3 h-3" /> Mark Delivered
                        </button>
                      )}
                    </td>
                  </tr>
                  
                  {/* Expanded Row Content */}
                  <AnimatePresence>
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan={6} className="p-0 border-0">
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-gray-50/80 border-b border-gray-100 overflow-hidden"
                          >
                            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-4">Order Items</h4>
                                <div className="space-y-3">
                                  {order.items.map((item: any) => (
                                    <div key={item._id} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                        {item.product.images?.[0] && <img src={`${item.product.images[0]}`} className="w-full h-full object-cover" />}
                                      </div>
                                      <div className="flex-1">
                                        <div className="font-bold text-sm text-foreground">{item.product.title}</div>
                                        <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                      </div>
                                      <div className="font-bold text-sm">₹{item.price * item.quantity}</div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200/60">
                                  <div className="flex justify-between text-sm font-bold">
                                    <span>Subtotal</span>
                                    <span>₹{order.subtotal}</span>
                                  </div>
                                  <div className="flex justify-between text-sm font-bold text-gray-500 mt-1">
                                    <span>Shipping</span>
                                    <span>₹{order.shippingCost}</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-bold text-xs uppercase tracking-wider text-gray-500 mb-4">Customer Details</h4>
                                <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                  <p className="font-bold text-foreground">{order.shippingAddress.fullName}</p>
                                  <p className="text-sm text-gray-600 mb-1">{order.shippingAddress.phoneNumber}</p>
                                  <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                                    {order.shippingAddress.addressLine}<br/>
                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                                  </p>
                                  
                                  {order.specialInstructions && (
                                    <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-sm text-yellow-800">
                                      <span className="font-bold block mb-1">Special Instructions:</span>
                                      {order.specialInstructions}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
