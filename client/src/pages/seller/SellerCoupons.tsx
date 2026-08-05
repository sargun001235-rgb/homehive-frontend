import { useState, useEffect } from 'react';
import { useCouponStore } from '../../store/useCouponStore';
import { Tag, Plus, Trash2, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SellerCoupons() {
  const { sellerCoupons, isLoading, fetchSellerCoupons, createCoupon, deleteCoupon } = useCouponStore();
  const [isCreating, setIsCreating] = useState(false);
  
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderValue: '',
    maxDiscount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    usageLimit: ''
  });

  useEffect(() => {
    fetchSellerCoupons();
  }, [fetchSellerCoupons]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createCoupon({
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderValue: formData.minOrderValue ? Number(formData.minOrderValue) : undefined,
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      usageLimit: formData.usageLimit ? Number(formData.usageLimit) : undefined,
    });
    setIsCreating(false);
    fetchSellerCoupons();
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-3xl border border-gray-200 shadow-sm gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center">
              <Tag className="w-6 h-6 mr-2 text-primary" /> Shop Coupons
            </h1>
            <p className="text-foreground/60 text-sm">Create and manage discount codes for your customers</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="px-5 py-2.5 bg-foreground text-white rounded-xl text-sm font-bold shadow-md hover:bg-black transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" /> New Coupon
          </button>
        </div>

        <AnimatePresence>
          {isCreating && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <form onSubmit={handleSubmit} className="p-6">
                <h3 className="text-lg font-bold mb-4">Create New Coupon</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="lg:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 mb-1">Coupon Code *</label>
                    <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER20" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none uppercase" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Discount Type *</label>
                    <select value={formData.discountType} onChange={e => setFormData({...formData, discountType: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Discount Value *</label>
                    <input required type="number" min="1" value={formData.discountValue} onChange={e => setFormData({...formData, discountValue: e.target.value})} placeholder={formData.discountType === 'percentage' ? "e.g. 20" : "e.g. 100"} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Min Order Value (₹)</label>
                    <input type="number" min="0" value={formData.minOrderValue} onChange={e => setFormData({...formData, minOrderValue: e.target.value})} placeholder="Optional" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Max Discount (₹)</label>
                    <input type="number" min="0" value={formData.maxDiscount} onChange={e => setFormData({...formData, maxDiscount: e.target.value})} placeholder="Optional (for %)" disabled={formData.discountType === 'fixed'} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Usage Limit</label>
                    <input type="number" min="1" value={formData.usageLimit} onChange={e => setFormData({...formData, usageLimit: e.target.value})} placeholder="Total redemptions" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                      <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
                      <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200">Cancel</button>
                  <button type="submit" disabled={isLoading} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow hover:bg-primary/90 disabled:opacity-50">
                    {isLoading ? 'Creating...' : 'Save Coupon'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {isLoading && !isCreating ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1,2,3].map(i => <div key={i} className="h-40 bg-white rounded-3xl border border-gray-200 shadow-sm animate-pulse" />)}
          </div>
        ) : sellerCoupons.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
            <Tag className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2 text-foreground">No coupons created</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto text-sm">Boost your sales by offering discounts to your customers.</p>
            <button onClick={() => setIsCreating(true)} className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold shadow-md hover:bg-primary/90">Create First Coupon</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sellerCoupons.map((coupon) => (
              <div key={coupon._id} className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-0"></div>
                
                <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-black border border-green-100 tracking-wider">
                    {coupon.code}
                  </div>
                  <button onClick={() => deleteCoupon(coupon._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-foreground mb-1">
                    {coupon.discountType === 'percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                  </h3>
                  <div className="text-xs text-gray-500 space-y-1 mt-3">
                    {coupon.minOrderValue && <p className="flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Min Order: ₹{coupon.minOrderValue}</p>}
                    {coupon.maxDiscount && coupon.discountType === 'percentage' && <p className="flex items-center"><DollarSign className="w-3 h-3 mr-1" /> Max Discount: ₹{coupon.maxDiscount}</p>}
                    <p className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> Valid: {new Date(coupon.startDate).toLocaleDateString()} - {new Date(coupon.endDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-xs font-bold relative z-10">
                  <div className="flex items-center text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-primary mr-2"></span>
                    {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : ''} Used
                  </div>
                  
                  {new Date() > new Date(coupon.endDate) || (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) ? (
                    <span className="flex items-center text-red-500"><XCircle className="w-3 h-3 mr-1" /> Inactive</span>
                  ) : (
                    <span className="flex items-center text-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Active</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
