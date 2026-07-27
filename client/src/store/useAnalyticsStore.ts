import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

export interface SalesGraphData {
  name: string;
  revenue: number;
  orders: number;
}

export interface TopProduct {
  _id: string;
  title: string;
  image: string;
  soldQuantity: number;
  revenue: number;
}

interface AnalyticsState {
  totalRevenue: number;
  totalOrders: number;
  visitors: number;
  conversionRate: number;
  salesGraph: SalesGraphData[];
  topProducts: TopProduct[];
  isLoading: boolean;
  fetchAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  totalRevenue: 0,
  totalOrders: 0,
  visitors: 0,
  conversionRate: 0,
  salesGraph: [],
  topProducts: [],
  isLoading: false,

  fetchAnalytics: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/analytics/seller');
      const analyticsData = (response as any).data;
      
      set({
        totalRevenue: analyticsData.totalRevenue || 0,
        totalOrders: analyticsData.totalOrders || 0,
        visitors: analyticsData.visitors || 0,
        conversionRate: analyticsData.conversionRate || 0,
        salesGraph: analyticsData.salesGraph || [],
        topProducts: analyticsData.topProducts || [],
        isLoading: false
      });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
}));
