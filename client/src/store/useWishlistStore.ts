import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface WishlistState {
  wishlistProducts: any[];
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  wishlistProducts: [],
  isLoading: false,

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/wishlist');
      set({ wishlistProducts: data.products || [] });
    } catch (error) {
      console.error('Failed to fetch wishlist', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addToWishlist: async (productId: string) => {
    try {
      const { data } = await api.post('/wishlist/add', { productId });
      set({ wishlistProducts: data.products });
      toast.success('Added to wishlist');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    }
  },

  removeFromWishlist: async (productId: string) => {
    try {
      const { data } = await api.delete(`/wishlist/remove/${productId}`);
      set({ wishlistProducts: data.products });
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove from wishlist');
    }
  },
  
  isInWishlist: (productId: string) => {
    return get().wishlistProducts.some(p => p._id === productId);
  }
}));
