import { create } from 'zustand';

type NewCategoryState = {
  parentId?: string;
  parentType?: string;
  isOpen: boolean;
  onOpen: (id: string, parentType: string) => void;
  onClose: () => void;
}

export const useNewCategory = create<NewCategoryState>((set) => ({
  id: undefined,
  isOpen: false,
  onOpen: (parentId?: string, parentType?: string) => set({ isOpen: true, parentId, parentType }),
  onClose: () => set({ isOpen: false }),
}));