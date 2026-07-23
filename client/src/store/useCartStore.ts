import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

export interface CartItem {
  product: any; // Populated Product
  quantity: number;
}

interface CartState {
  cartItems: CartItem[];
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: () => number;
  cartCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/cart');
      set({ cartItems: data.items || [] });
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId: string, quantity = 1) => {
    try {
      const { data } = await api.post('/cart/add', { productId, quantity });
      set({ cartItems: data.items });
      toast.success('Added to cart');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    try {
      const { data } = await api.put('/cart/update', { productId, quantity });
      set({ cartItems: data.items });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update quantity');
    }
  },

  removeFromCart: async (productId: string) => {
    try {
      const { data } = await api.delete(`/cart/remove/${productId}`);
      set({ cartItems: data.items });
      toast.success('Removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    }
  },

  clearCart: async () => {
    try {
      await api.delete('/cart/clear');
      set({ cartItems: [] });
    } catch (error) {
      console.error('Failed to clear cart', error);
    }
  },

  cartTotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0);
  },

  cartCount: () => {
    const { cartItems } = get();
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }
}));
