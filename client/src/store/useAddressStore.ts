import { create } from 'zustand';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface AddressState {
  addresses: any[];
  isLoading: boolean;
  fetchAddresses: () => Promise<void>;
  addAddress: (addressData: any) => Promise<any>;
  deleteAddress: (id: string) => Promise<void>;
}

export const useAddressStore = create<AddressState>((set) => ({
  addresses: [],
  isLoading: false,

  fetchAddresses: async () => {
    set({ isLoading: true });
    try {
      const { data } = await api.get('/address');
      set({ addresses: data });
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addAddress: async (addressData: any) => {
    try {
      const { data } = await api.post('/address/add', addressData);
      set(state => ({
        addresses: addressData.isDefault 
          ? [data, ...state.addresses.map(a => ({ ...a, isDefault: false }))]
          : [...state.addresses, data]
      }));
      toast.success('Address saved successfully');
      return data;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add address');
      throw error;
    }
  },

  deleteAddress: async (id: string) => {
    try {
      await api.delete(`/address/${id}`);
      set(state => ({ addresses: state.addresses.filter(a => a._id !== id) }));
      toast.success('Address removed');
    } catch (error) {
      toast.error('Failed to remove address');
    }
  }
}));
