import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface CouponState {
  sellerCoupons: any[];
  isLoading: boolean;
  isValidating: boolean;
  appliedCoupon: any | null;
  fetchSellerCoupons: () => Promise<void>;
  createCoupon: (data: any) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  validateCoupon: (code: string, shopId: string, orderValue: number) => Promise<any>;
  clearAppliedCoupon: () => void;
}

export const useCouponStore = create<CouponState>((set) => ({
  sellerCoupons: [],
  isLoading: false,
  isValidating: false,
  appliedCoupon: null,

  fetchSellerCoupons: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/coupons');
      set({ sellerCoupons: (response as any).data || [] });
    } catch (error) {
      console.error('Failed to fetch coupons');
    } finally {
      set({ isLoading: false });
    }
  },

  createCoupon: async (data: any) => {
    set({ isLoading: true });
    try {
      await api.post('/coupons', data);
      toast.success('Coupon created successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  deleteCoupon: async (id: string) => {
    try {
      await api.delete(`/coupons/${id}`);
      set(state => ({
        sellerCoupons: state.sellerCoupons.filter(c => c._id !== id)
      }));
      toast.success('Coupon deleted');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    }
  },

  validateCoupon: async (code: string, shopId: string, orderValue: number) => {
    set({ isValidating: true });
    try {
      const response = await api.post('/coupons/validate', { code, shopId, orderValue });
      const couponData = (response as any).data;
      set({ appliedCoupon: couponData });
      toast.success('Coupon applied successfully!');
      return couponData;
    } catch (error: any) {
      set({ appliedCoupon: null });
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      throw error;
    } finally {
      set({ isValidating: false });
    }
  },

  clearAppliedCoupon: () => set({ appliedCoupon: null })
}));
