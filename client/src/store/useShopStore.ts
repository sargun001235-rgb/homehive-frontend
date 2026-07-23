import { create } from 'zustand';
import api from '../utils/api';

export interface Shop {
  _id: string;
  name: string;
  logo?: string;
  banner?: string;
  category: string;
  description: string;
  city: string;
  address: string;
  phone: string;
  businessHours: string;
  socialLinks: {
    instagram?: string;
    facebook?: string;
    whatsapp?: string;
  };
  verified: boolean;
  userId?: any;
}

interface ShopState {
  myShop: Shop | null;
  isLoading: boolean;
  fetchMyShop: () => Promise<void>;
}

export const useShopStore = create<ShopState>((set) => ({
  myShop: null,
  isLoading: false,
  fetchMyShop: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/shop/me');
      set({ myShop: data, isLoading: false });
    } catch (error) {
      set({ myShop: null, isLoading: false });
    }
  },
}));
