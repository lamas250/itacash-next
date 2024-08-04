import { create } from 'zustand';

type OpenCategoryState = {
  id?: string;
  isOpen: boolean;
  onOpen: (id: string, categoryType: string) => void;
  onClose: () => void;
  categoryType?: string;
}

export const useOpenCategory = create<OpenCategoryState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (id: string, categoryType: string) => set({ isOpen: true, id, categoryType }),
  onClose: () => set({ isOpen: false, id: undefined }),
}));