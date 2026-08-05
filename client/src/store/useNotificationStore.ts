import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'order' | 'review' | 'system' | 'wishlist';
  read: boolean;
  link?: string;
  createdAt: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const response = await api.get('/notifications');
      const data = (response as any).data;
      
      set({
        notifications: data || [],
        unreadCount: (response as any).unreadCount || 0,
        isLoading: false
      });
    } catch (error: any) {
      set({ isLoading: false });
      console.error('Failed to fetch notifications');
    }
  },

  markAsRead: async (id: string) => {
    try {
      await api.put(`/notifications/${id}/read`);
      
      if (id === 'all') {
        set({
          notifications: get().notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        });
      } else {
        set({
          notifications: get().notifications.map(n => 
            n._id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, get().unreadCount - 1)
        });
      }
    } catch (error: any) {
      toast.error('Failed to mark notification as read');
    }
  }
}));
