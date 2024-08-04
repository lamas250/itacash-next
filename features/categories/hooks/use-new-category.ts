import { create } from 'zustand';

type NewCategoryState = {
  parentId?: string;
  isOpen: boolean;
  onOpen: (id: string) => void;
  onClose: () => void;
}

export const useNewCategory = create<NewCategoryState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (parentId?: string) => set({ isOpen: true, parentId }),
  onClose: () => set({ isOpen: false }),
}));