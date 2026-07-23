import { create } from 'zustand';
import api from '../utils/api';

export interface Product {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  images: string[];
  tags: string[];
  shopId?: any;
  sellerId?: any;
}

interface ProductState {
  sellerProducts: Product[];
  marketplaceProducts: Product[];
  recentlyViewed: Product[];
  isLoading: boolean;
  fetchSellerProducts: () => Promise<void>;
  fetchMarketplaceProducts: (params?: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addRecentlyViewed: (product: Product) => void;
}

export const useProductStore = create<ProductState>((set, get) => {
  const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
  
  return {
    sellerProducts: [],
    marketplaceProducts: [],
    recentlyViewed: savedRecentlyViewed ? JSON.parse(savedRecentlyViewed) : [],
    isLoading: false,
    
    fetchSellerProducts: async () => {
      set({ isLoading: true });
      try {
        const { data } = await api.get('/product/seller');
        set({ sellerProducts: data, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
      }
    },

    fetchMarketplaceProducts: async (params) => {
      set({ isLoading: true });
      try {
        const { data } = await api.get('/product', { params });
        set({ marketplaceProducts: data, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
      }
    },

    deleteProduct: async (id: string) => {
      try {
        await api.delete(`/product/${id}`);
        set({ sellerProducts: get().sellerProducts.filter((p) => p._id !== id) });
      } catch (error) {
        console.error('Failed to delete product', error);
        throw error;
      }
    },

    addRecentlyViewed: (product: Product) => {
      const current = get().recentlyViewed;
      const exists = current.find(p => p._id === product._id);
      if (exists) return; // already viewed

      const updated = [product, ...current].slice(0, 10); // keep max 10
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      set({ recentlyViewed: updated });
    }
  };
});
