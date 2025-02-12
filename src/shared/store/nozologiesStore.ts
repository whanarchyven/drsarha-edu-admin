import { create } from 'zustand';
import { nozologiesApi } from '@/shared/api/nozologies';
import type { Nozology } from '@/shared/models/Nozology';
import type { BaseQueryParams } from '@/shared/api/types';

interface NozologiesState {
  items: Nozology[];
  isLoading: boolean;
  fetchNozologies: (params?: BaseQueryParams) => Promise<void>;
}

export const useNozologiesStore = create<NozologiesState>((set) => ({
  items: [],
  isLoading: false,
  fetchNozologies: async (params) => {
    set({ isLoading: true });
    try {
      const response = await nozologiesApi.getAll(params);
      set({
        items: Array.isArray(response) ? response : [],
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching nozologies:', error);
      set({ isLoading: false });
    }
  },
})); 