import { create } from 'zustand';

type NewTransactionState = {
  type: 'income' | 'expense';
  isOpen: boolean;
  onOpen: (type: 'income' | 'expense') => void;
  onClose: () => void;
}

export const useNewTransaction = create<NewTransactionState>((set) => ({
  isOpen: false,
  onOpen: (type: 'income' | 'expense') => set({ isOpen: true, type }),
  onClose: () => set({ isOpen: false }),
  type: 'expense',
}));