import { Wallet } from "@/types/wallet.types";
import { create } from "zustand";

interface WalletState {
  wallet: Wallet | null;
  setWallet: (value: Wallet | null) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallet: null,
  setWallet(value) {
    set({ wallet: value });
  },
}));
