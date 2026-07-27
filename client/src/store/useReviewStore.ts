import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

export interface Review {
  _id: string;
  product: string;
  user: {
    _id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  photos: string[];
  likes: string[];
  verifiedPurchase: boolean;
  sellerResponse?: string;
  createdAt: string;
}

export interface ReviewStats {
  _id: string;
  averageRating: number;
  totalReviews: number;
  fiveStar: number;
  fourStar: number;
  threeStar: number;
  twoStar: number;
  oneStar: number;
}

interface ReviewState {
  reviews: Review[];
  stats: ReviewStats | null;
  isLoading: boolean;
  page: number;
  totalPages: number;
  total: number;
  fetchReviews: (productId: string, page?: number, sort?: string, rating?: number, withPhotos?: boolean) => Promise<void>;
  createReview: (data: { product: string; rating: number; comment: string; photos: string[] }) => Promise<boolean>;
  toggleLike: (reviewId: string) => Promise<void>;
  replyToReview: (reviewId: string, sellerResponse: string) => Promise<void>;
}

export const useReviewStore = create<ReviewState>((set, get) => ({
  reviews: [],
  stats: null,
  isLoading: false,
  page: 1,
  totalPages: 1,
  total: 0,

  fetchReviews: async (productId, page = 1, sort = 'newest', rating, withPhotos) => {
    set({ isLoading: true });
    try {
      const params: any = { page, limit: 5, sort };
      if (rating) params.rating = rating;
      if (withPhotos) params.withPhotos = withPhotos;

      const response = await api.get(`/reviews/product/${productId}`, { params });
      
      // Axios interceptor extracts .data, so response is { success, count, total, page, totalPages, data: reviews, stats }
      const resData = response as any;
      
      set({
        reviews: page === 1 ? resData.data : [...get().reviews, ...resData.data],
        stats: resData.stats || null,
        page: resData.page,
        totalPages: resData.totalPages,
        total: resData.total,
        isLoading: false
      });
    } catch (error: any) {
      set({ isLoading: false });
      toast.error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  },

  createReview: async (data) => {
    try {
      const response = await api.post('/reviews', data);
      const newReview = (response as any).data;
      
      // Update local state by placing the new review at the top (optimistic-ish)
      set({
        reviews: [newReview, ...get().reviews],
        total: get().total + 1
      });
      
      toast.success('Review submitted successfully!');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review');
      return false;
    }
  },

  toggleLike: async (reviewId) => {
    try {
      const response = await api.put(`/reviews/${reviewId}/like`);
      const updatedReview = (response as any).data;
      
      set({
        reviews: get().reviews.map((r) => r._id === reviewId ? { ...r, likes: updatedReview.likes } : r)
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to like review');
    }
  },

  replyToReview: async (reviewId, sellerResponse) => {
    try {
      const response = await api.put(`/reviews/${reviewId}/reply`, { sellerResponse });
      const updatedReview = (response as any).data;
      
      set({
        reviews: get().reviews.map((r) => r._id === reviewId ? { ...r, sellerResponse: updatedReview.sellerResponse } : r)
      });
      toast.success('Reply submitted');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit reply');
    }
  }
}));
