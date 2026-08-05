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
  isFeatured: boolean;
  shopId?: any;
  sellerId?: any;
}

interface ProductState {
  sellerProducts: Product[];
  marketplaceProducts: Product[];
  featuredProducts: Product[];
  recentlyViewed: Product[];
  isLoading: boolean;
  fetchSellerProducts: () => Promise<void>;
  fetchMarketplaceProducts: (params?: any) => Promise<void>;
  fetchFeaturedProducts: () => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addRecentlyViewed: (product: Product) => void;
}

export const useProductStore = create<ProductState>((set, get) => {
  const savedRecentlyViewed = localStorage.getItem('recentlyViewed');
  
  return {
    sellerProducts: [],
    marketplaceProducts: [],
    featuredProducts: [],
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

    fetchFeaturedProducts: async () => {
      try {
        const { data } = await api.get('/product', { params: { featured: 'true', limit: 5 } });
        set({ featuredProducts: data });
      } catch (error) {
        console.error('Failed to fetch featured products', error);
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
