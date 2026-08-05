import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface OrderState {
  customerOrders: any[];
  sellerOrders: any[];
  currentOrder: any | null;
  isLoading: boolean;
  fetchCustomerOrders: () => Promise<void>;
  fetchSellerOrders: () => Promise<void>;
  fetchOrderDetails: (id: string) => Promise<void>;
  createOrder: (shippingAddress: any, specialInstructions: string, couponCode?: string) => Promise<any>;
  updateOrderStatus: (id: string, status: string) => Promise<void>;
}

export const useOrderStore = create<OrderState>((set) => ({
  customerOrders: [],
  sellerOrders: [],
  currentOrder: null,
  isLoading: false,

  fetchCustomerOrders: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/order/customer');
      set({ customerOrders: data });
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSellerOrders: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/order/seller');
      set({ sellerOrders: data });
    } catch (error) {
      console.error('Failed to fetch seller orders', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchOrderDetails: async (id: string) => {
    set({ isLoading: true });
    try {
      const { data } = await api.get(`/order/details/${id}`);
      set({ currentOrder: data });
    } catch (error) {
      console.error('Failed to fetch order details', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createOrder: async (shippingAddress: any, specialInstructions: string, couponCode?: string) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post('/order/create', { shippingAddress, specialInstructions, couponCode });
      return data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    try {
      const { data } = await api.put(`/order/update-status/${id}`, { status });
      set(state => ({
        sellerOrders: state.sellerOrders.map(o => o._id === id ? data : o),
        customerOrders: state.customerOrders.map(o => o._id === id ? data : o),
        currentOrder: state.currentOrder?._id === id ? data : state.currentOrder
      }));
      toast.success('Order status updated');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  }
}));
