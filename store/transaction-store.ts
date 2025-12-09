import { create } from "zustand";

interface TransactionState {
  recipientId: string | null;
  setRecipientId: (id: string | null) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  recipientId: null,
  setRecipientId: (id: string | null) => set({ recipientId: id }),
}));
